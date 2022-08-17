import GBDownload from "../../../pageObjects/GBDownload"
import genericPage from "../../../pageObjects/genericPage"
import ApiResponse from "../../../pageObjects/ApiResponse"

describe("GB download - AMR Electric", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const objApiResponse = new ApiResponse()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    const gatewayId = '3'
    var objLength
    var billingStartTs
    var billingEndTs
    var strStartDate
    var strEndDate
    var strMinDate
    var strMaxDate
    var strNewStartDate
    var newEpochStartTs
    var strNewEndDate
    var newEpochEndTs
    var arrValues = []
    var strObj = ''
    var meterToken
    const uuid = '32b638d1-ceb2-4d3b-9091-981f34c263f9'
    var strMeasurementType = 'ELECTRIC'
    var bearerToken
    var userHash
    var baseUrl = Cypress.env('baseURL')

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.log(bearerToken)
            objGenericPage.userHashApiResponse(uuid, pilotData.pilotId).then((res) => {
                cy.log(res.payload)
                userHash = res.payload
            })
        })
    })

    it("Invoice data API response", () => {
        cy.visit(pilotData.url + "dashboard?user-hash=" + userHash)
        cy.log(bearerToken)
        objApiResponse.invoiceDataResponse(uuid, strMeasurementType, bearerToken)
            .then((res) => {
                cy.log(res)
                objLength = Object.keys(res).length;
                cy.log(objLength)
                var firstKey = Object.keys(res)[objLength - 1];
                let objData = res[firstKey]
                cy.log(objData)

                var objFirst = Object.keys(res)[0]
                var firstObjData = res[objFirst]
                var firstBillingStartTs = firstObjData['billingStartTs']
                var firstStartTs = new Date(firstBillingStartTs * 1000);
                strMinDate = objGenericPage.changDateFormat(firstStartTs.toDateString())

                billingEndTs = objData['billingEndTs']
                billingStartTs = objData['billingStartTs']
                cy.log(billingStartTs)
                cy.log(billingEndTs)
                var startTs = new Date(billingStartTs * 1000);
                var endTs = new Date(billingEndTs * 1000);
                endTs.setDate(endTs.getDate() - 1)
                cy.log(startTs.toLocaleString())
                cy.log(endTs.toDateString())
                strStartDate = objGenericPage.changDateFormat(startTs.toDateString())
                strEndDate = objGenericPage.changDateFormat(endTs.toDateString())
                cy.log('Start date - ' + strStartDate)
                cy.wrap(strStartDate).as('strStartDate');

                var newStartTs = new Date(billingEndTs * 1000);
                newStartTs.setDate(newStartTs.getDate() - 10)
                strNewStartDate = objGenericPage.changDateFormat(newStartTs.toDateString())
                newEpochStartTs = newStartTs.getTime() / 1000

                var newEndTs = new Date(billingEndTs * 1000);
                newEndTs.setDate(newEndTs.getDate() - 1)
                strNewEndDate = objGenericPage.changDateFormat(newEndTs.toDateString())
                newEpochEndTs = newEndTs.getTime() / 1000
            })
    })

    it("Navigate to Download my data", () => {
        objGenericPage.checkHeader()
        cy.wait(1000)
        objGenericPage.clickDownloadMyData()
        cy.wait(1000)
    })
    it("Export data - Bill period", () => {
        var billPeriodStartDate = objGenericPage.changDateFormatString(strStartDate)
        var billPeriodEndDate = objGenericPage.changDateFormatString(strEndDate)
        var strBillPeriodDate = billPeriodStartDate + ' - ' + billPeriodEndDate
        cy.log(strBillPeriodDate)
        objGbDownload.verifyPageTitle();
        objGbDownload.verifySubtitle()
        objGbDownload.verifyExportBillLabel()
        objGbDownload.verifyExportDaysLabel()
        objGbDownload.verifyDataMsg()
        objGbDownload.selectDropdownElement(strBillPeriodDate, objLength)

        cy.get(objGbDownload.exportBtn)
            .should('have.css', 'background-color')
            .and('eq', 'rgb(27, 108, 181)')

        cy.get(objGbDownload.exportBtn)
            .should('have.css', 'cursor')
            .and('eq', 'pointer')

        cy.get('.download-page-btn').contains('Cancel')
            .should('have.css', 'background-color')
            .and('eq', 'rgba(0, 0, 0, 0)')

        cy.get('.download-page-btn').contains('Cancel')
            .should('have.css', 'cursor')
            .and('eq', 'pointer')

        objGbDownload.clickExport()
        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
    })

    it("Export data - Calendar Days", () => {
        cy.contains('Export usage for range of days').click()
        cy.wait(200)
        cy.get(objGbDownload.calendarIcon).eq(0).should('be.visible')
        cy.get(objGbDownload.calendarIcon).eq(1).should('be.visible')

        cy.get(objGbDownload.calendarIcon).eq(0).click()
        cy.get('[aria-label="Go to the previous month"]').click()
        cy.get('[role="presentation"]').eq(10).click()

        cy.get(objGbDownload.calendarIcon).eq(1).click()
        cy.get('[aria-label="Go to the previous month"]').click()
        cy.get('[role="presentation"]').eq(11).click()
        objGbDownload.clickExport()
        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
        cy.wait(500)

        //Min and max dates
        objGbDownload.enterFromDate(strMinDate)
        objGbDownload.enterToDate(strEndDate)
        objGbDownload.clickExport()
        objGbDownload.checkSuccessMsg('Please select a date range that does not exceed one year.')

        //Same date
        objGbDownload.enterFromDate(strStartDate)
        objGbDownload.enterToDate(strStartDate)
        objGbDownload.clickExport()
        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
    })

    it("Export data - Days", () => {
        cy.deleteDownloadsFolder()
        cy.contains('Export usage for range of days').click()
        objGbDownload.enterFromDate('16/09/20')
        objGbDownload.checkErrorMsg('Invalid Date Format')
        objGbDownload.enterFromDate('03/02/2000')
        objGbDownload.checkErrorMsg('Date should not be before minimal date')
        objGbDownload.enterFromDate(strStartDate)
        objGbDownload.enterToDate('56/09/2022')
        objGbDownload.checkErrorMsg('Invalid Date Format')
        objGbDownload.enterToDate('08/05/2050')
        objGbDownload.checkErrorMsg('Date should not be after maximal date')
        objGbDownload.enterToDate(strEndDate)
        objGbDownload.clickExport()
        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
    })

    it("Check Disabled fields", () => {
        cy.contains('Export usage for range of bill period').click()
        cy.wait(500)
        cy.get(objGbDownload.fromDate).should('be.disabled')
        cy.get(objGbDownload.toDate).should('be.disabled')
        cy.get(objGbDownload.calendarIcon).parent().parent().should('be.disabled')
        cy.contains('Export usage for range of days').click()
        cy.wait(500)
        cy.get(objGbDownload.dropdownEle).should('have.attr', 'aria-disabled', 'true')
    })

    it("Cancel button", () => {
        objGbDownload.clickCancelBtn()
        cy.wait(500)
        cy.get('.home-page-main', { timeout: 10000 }).should('be.visible')
    })

    it('Fetch values from RAW data', () => {
        objApiResponse.gbJsonResponse(uuid, gatewayId, billingStartTs, newEpochEndTs, bearerToken)
            .then((res) => {
                cy.log(res)
                var firstKey = Object.keys(res)[0];
                let objData = res[firstKey]
                cy.log(objData)
                // let billingEndTs = objData['billingEndTs']
                for (let index = 0; index < res.length - 1; index++) {
                    const element = res[index];
                    console.log(element)
                    const time = element['time']
                    var value = element['value']
                    const duration = element['duration']
                    value = Math.round(value)
                    cy.log(value)
                    strObj = '<espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>' + duration + '</espi:duration><espi:start>' + time + '</espi:start></espi:timePeriod><espi:value>' + value + '</espi:value></espi:IntervalReading>'
                    arrValues.push(strObj)
                    // console.log(strObj)

                }
            })
    })

    it('Fetch values from Meter API', () => {
        objApiResponse.meterApiResponse(uuid, gatewayId, bearerToken)
            .then((res) => {
                cy.log(res)
                var strMeterObj = '/users/' + uuid + '/homes/1/gws/' + gatewayId + '/meters/1'
                var meterObj = res[strMeterObj]
                meterToken = meterObj.token
                cy.log(meterToken)
            })
    })

    it('Read download file', () => {
        cy.task('downloads', 'cypress/downloads').then(after => {
            console.log(after)
            console.log(strObj)
            cy.readFile("cypress/downloads/" + after).then(fileToRead => {
                cy.wrap(fileToRead).should('contain', 'Green Button Data File. Meter: ' + meterToken)
                cy.wrap(fileToRead).should('contain', '<espi:ReadingType><espi:accumulationBehaviour>4</espi:accumulationBehaviour><espi:commodity>1</espi:commodity><espi:dataQualifier>12</espi:dataQualifier><espi:defaultQuality>17</espi:defaultQuality><espi:flowDirection>1</espi:flowDirection><espi:intervalLength>86400</espi:intervalLength><espi:kind>12</espi:kind><espi:phase>769</espi:phase><espi:powerOfTenMultiplier>0</espi:powerOfTenMultiplier><espi:timeAttribute>0</espi:timeAttribute><espi:uom>72</espi:uom></espi:ReadingType>')
                for (let index = 0; index < arrValues.length; index++) {
                    const element = arrValues[index];
                    console.log(element)
                    cy.wrap(fileToRead).should('contain', element)
                }
            })
        })
    })

    it("Upload data - DMD Validator", () => {
        cy.visit("https://dmdvalidator.greenbuttonalliance.org/")
        cy.get('#FBSelection', { timeout: 10000 }).should('be.visible')
        cy.get('select').select('Energy Usage file: Electricity Interval Metering')
        cy.wait(200)
        cy.get('#FB_15').uncheck({ force: true })
        cy.wait(500)
        cy.task('downloads', 'cypress/downloads').then(p => {
            //file to be uploaded path in project folder
            const fileToUpload = "../downloads/" + p
            cy.log(fileToUpload)
            //upload file with attachFile
            cy.get('#dropZone')
                .attachFile(fileToUpload, { subjectType: 'drag-n-drop' });
            cy.get('thead > tr > td', { timeout: 15000 }).should('have.text', ' ...all tests were successful. ...all tests were successful. ...all tests were successful.')
            cy.get('.text-danger').should('not.exist')
        })
    })
})