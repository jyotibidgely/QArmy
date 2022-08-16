import GBDownload from "../../../pageObjects/GBDownload"
import genericPage from "../../../pageObjects/genericPage"
import ApiResponse from "../../../pageObjects/ApiResponse"

describe("GB download - Dual fuel", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const objApiResponse = new ApiResponse()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    const uuidDualAMREG = '896eed18-4088-460e-a97b-cf2b7921d8e1'
    const uuidNoInvoice = '193155f8-c2af-4bdf-a749-c4dee1254012'
    const gatewayIdEAmr = '3'
    const gatewayIdGAmr = '4'
    var bearerToken
    var arrValues = []
    var arrValuesGas = []
    var meterTokenE
    var meterTokenG
    var billingStartTs
    var billingEndTs
    var strMeasurementType = 'ELECTRIC'
    var strMeasurementTypeGas = 'GAS'

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.log(bearerToken)
        })
    })

    it("Navigate to Download my data & Export data - AMR Electric", () => {
        cy.log('UUID - ' + uuidDualAMREG)
        objGenericPage.userHashApiResponse(uuidDualAMREG, pilotData.pilotId).then((res) => {
            cy.log(res.payload)
            cy.visit(pilotData.url + "dashboard?user-hash=" + res.payload)
            objApiResponse.invoiceDataResponse(uuidDualAMREG, strMeasurementType, bearerToken)
                .then((res) => {
                    cy.log(res)
                    var objLength = Object.keys(res).length;
                    cy.log(objLength)
                    var firstKey = Object.keys(res)[objLength - 1];
                    let objData = res[firstKey]
                    cy.log(objData)
                    billingEndTs = objData['billingEndTs']
                    billingStartTs = objData['billingStartTs']
                    cy.log(billingStartTs)
                    cy.log(billingEndTs)
                    var startTs = new Date(billingStartTs * 1000);
                    var endTs = new Date(billingEndTs * 1000);
                    endTs.setDate(endTs.getDate() - 1)
                    cy.log(startTs.toLocaleString())
                    cy.log(endTs.toDateString())
                    var strStartDate = objGenericPage.changDateFormat(startTs.toDateString())
                    var strEndDate = objGenericPage.changDateFormat(endTs.toDateString())
                    cy.log('Start date - ' + strStartDate)
                    objGenericPage.selectFuelType('Electric')
                    objGenericPage.checkHeader()
                    objGenericPage.checkFuelLabel('Electric')
                    cy.get(objGenericPage.electricFuelIcon).should('be.visible')
                    cy.wait(1000)
                    objGenericPage.clickDownloadMyData()
                    cy.wait(500)
                    objGenericPage.loadingScreenIndicator()
                    cy.wait(1000)
                    cy.contains('Export usage for range of days').click()
                    objGbDownload.enterFromDate(strStartDate)
                    objGbDownload.enterToDate(strEndDate)
                    objGbDownload.clickExport()
                    objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                    cy.wait(2000)
                    objGenericPage.selectFuelTypeUsingMenuButton('Gas')

                })
        })
    })

    it('Fetch values from Meter API - AMR Electric', () => {
        //RAW DATA//
        objApiResponse.gbJsonResponse(uuidDualAMREG, gatewayIdEAmr, billingStartTs, billingEndTs, bearerToken)
            .then((res) => {
                cy.log(res)
                var firstKey = Object.keys(res)[0];
                let objData = res[firstKey]
                cy.log(objData)
                for (let index = 0; index < res.length - 1; index++) {
                    const element = res[index];
                    console.log(element)
                    const time = element['time']
                    var value = element['value']
                    const duration = element['duration']
                    value = Math.round(value)
                    cy.log(value)
                    var strObj = '<espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>' + duration + '</espi:duration><espi:start>' + time + '</espi:start></espi:timePeriod><espi:value>' + value + '</espi:value></espi:IntervalReading>'
                    arrValues.push(strObj)
                }
            })
        objApiResponse.meterApiResponse(uuidDualAMREG, gatewayIdEAmr, bearerToken)
            .then((res) => {
                cy.log(res)
                var strMeterObj = '/users/' + uuidDualAMREG + '/homes/1/gws/' + gatewayIdEAmr + '/meters/1'
                var meterObj = res[strMeterObj]
                meterTokenE = meterObj.token
                cy.log(meterTokenE)
            })
    })

    it('Read download file - AMR Electric', () => {
        cy.task('downloads', 'cypress/downloads').then(after => {
            console.log(after)
            // console.log(strObj)
            cy.readFile("cypress/downloads/" + after).then(fileToRead => {
                cy.wrap(fileToRead).should('contain', 'Green Button Data File. Meter: ' + meterTokenE)
                cy.wrap(fileToRead).should('contain', '<espi:ReadingType><espi:accumulationBehaviour>4</espi:accumulationBehaviour><espi:commodity>1</espi:commodity><espi:dataQualifier>12</espi:dataQualifier><espi:defaultQuality>17</espi:defaultQuality><espi:flowDirection>1</espi:flowDirection><espi:intervalLength>86400</espi:intervalLength><espi:kind>12</espi:kind><espi:phase>769</espi:phase><espi:powerOfTenMultiplier>0</espi:powerOfTenMultiplier><espi:timeAttribute>0</espi:timeAttribute><espi:uom>72</espi:uom></espi:ReadingType>')
                for (let index = 0; index < arrValues.length; index++) {
                    const element = arrValues[index];
                    console.log(element)
                    cy.wrap(fileToRead).should('contain', element)
                }
            })
        })
    })

    it("Navigate to Download my data & Export data - AMR Gas", () => {
        objApiResponse.invoiceDataResponse(uuidDualAMREG, strMeasurementTypeGas, bearerToken)
            .then((res) => {
                cy.log(res)
                var objLength = Object.keys(res).length;
                cy.log(objLength)
                var firstKey = Object.keys(res)[objLength - 1];
                let objData = res[firstKey]
                cy.log(objData)
                billingEndTs = objData['billingEndTs']
                billingStartTs = objData['billingStartTs']
                cy.log(billingStartTs)
                cy.log(billingEndTs)
                var startTs = new Date(billingStartTs * 1000);
                var endTs = new Date(billingEndTs * 1000);
                endTs.setDate(endTs.getDate() - 1)
                cy.log(startTs.toLocaleString())
                cy.log(endTs.toDateString())
                var strStartDate = objGenericPage.changDateFormat(startTs.toDateString())
                var strEndDate = objGenericPage.changDateFormat(endTs.toDateString())
                cy.log('Start date - ' + strStartDate)
                // objGenericPage.selectFuelTypeUsingMenuButton('Gas')
                objGenericPage.checkFuelLabel('Gas')
                cy.get(objGenericPage.gasFuelIcon).should('be.visible')
                cy.wait(2000)
                objGenericPage.checkHeader()
                cy.wait(1000)
                objGenericPage.clickDownloadMyData()
                cy.wait(500)
                objGenericPage.loadingScreenIndicator()
                cy.wait(1000)
                cy.contains('Export usage for range of days').click()
                objGbDownload.enterFromDate(strStartDate)
                objGbDownload.enterToDate(strEndDate)
                objGbDownload.clickExport()
                objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
            })
    })

    it('Fetch values from Meter API - AMR Gas', () => {
        //RAW DATA//

        objApiResponse.gbJsonResponse(uuidDualAMREG, gatewayIdGAmr, billingStartTs, billingEndTs, bearerToken)
            .then((res) => {
                cy.log(res)
                var firstKey = Object.keys(res)[0];
                let objData = res[firstKey]
                cy.log(objData)
                for (let index = 0; index < res.length - 1; index++) {
                    const element = res[index];
                    console.log(element)
                    const time = element['time']
                    var value = element['value']
                    const duration = element['duration']
                    value = (value * 3600) / (3600 * 1000 * 1.037 * 29.3);
                    value = Math.round(value * 10) / 10         //round to one decimal place
                    value = value * 100000
                    value = Math.trunc(value)
                    cy.log(value)
                    var strObj = '<espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>' + duration + '</espi:duration><espi:start>' + time + '</espi:start></espi:timePeriod><espi:value>' + value + '</espi:value></espi:IntervalReading>'
                    arrValuesGas.push(strObj)
                }
            })
        objApiResponse.meterApiResponse(uuidDualAMREG, gatewayIdGAmr, bearerToken)
            .then((res) => {
                cy.log(res)
                var strMeterObj = '/users/' + uuidDualAMREG + '/homes/1/gws/' + gatewayIdGAmr + '/meters/1'
                var meterObj = res[strMeterObj]
                meterTokenG = meterObj.token
                cy.log(meterTokenG)
            })
    })

    it('Read download file - AMR Gas', () => {
        cy.task('downloads', 'cypress/downloads').then(after => {
            console.log(after)
            cy.readFile("cypress/downloads/" + after).then(fileToRead => {
                cy.wrap(fileToRead).should('contain', 'Green Button Data File. Meter: ' + meterTokenG)
                cy.wrap(fileToRead).should('contain', '<espi:ReadingType><espi:accumulationBehaviour>4</espi:accumulationBehaviour><espi:commodity>7</espi:commodity><espi:dataQualifier>12</espi:dataQualifier><espi:defaultQuality>17</espi:defaultQuality><espi:flowDirection>1</espi:flowDirection><espi:intervalLength>86400</espi:intervalLength><espi:kind>58</espi:kind><espi:phase>769</espi:phase><espi:powerOfTenMultiplier>-3</espi:powerOfTenMultiplier><espi:timeAttribute>0</espi:timeAttribute><espi:uom>119</espi:uom></espi:ReadingType>')
                for (let index = 0; index < arrValuesGas.length; index++) {
                    const element = arrValuesGas[index];
                    console.log(element)
                    cy.wrap(fileToRead).should('contain', element)
                }
            })
        })
    })

    it("Navigate to Download my data & Export data - No Invoice data", () => {
        generateUrl(uuidNoInvoice, 'Electric')
        generateUrl(uuidNoInvoice, 'Gas')
    })

    function generateUrl(uuid, fuelType) {
        cy.log('UUID - ' + uuid)
        objGenericPage.userHashApiResponse(uuid, pilotData.pilotId).then((res) => {
            cy.log(res.payload)
            cy.visit(pilotData.url + "dashboard?user-hash=" + res.payload)
            objGenericPage.selectFuelType(fuelType)
            objGenericPage.checkHeader()
            cy.wait(1000)
            objGenericPage.clickDownloadMyData()
            cy.wait(500)
            objGenericPage.loadingScreenIndicator()
            cy.wait(1000)
            cy.contains('Export usage for range of days').click()
            cy.get(objGbDownload.calendarIcon).eq(0).click()
            cy.get('[aria-label="Go to the previous month"]').click()
            cy.get('[role="presentation"]').eq(10).click()
            cy.get(objGbDownload.calendarIcon).eq(1).click()
            cy.get('[aria-label="Go to the previous month"]').click()
            cy.get('[role="presentation"]').eq(11).click()
            objGbDownload.clickExport()
            objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
        })
    }

})