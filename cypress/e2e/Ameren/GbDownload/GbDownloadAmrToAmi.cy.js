import GBDownload from "../../../pageObjects/GBDownload"
import genericPage from "../../../pageObjects/genericPage"

describe("GB download - AMR To AMI Electric", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    let objLength
    var strMinStartDate
    var strMinEndDate
    const uuidAmrToAmi = 'efdd88eb-d301-43fa-8649-e1dcf8039ed0'
    const uuidTwo = 'fe65a626-a7ae-4dcc-bb88-b00230b5e6c2'
    var bearerToken
    var userHash
    var baseUrl = Cypress.env('baseURL')
    var transitionBillingStartTs
    var transitionBillingEndTs
    var arrValues = []
    var strObj = ''
    var strObjTwo = ''

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.log(bearerToken)
        })
    })

    it("Navigate to Download my data & Export data - 1 BC missing", () => {
        generateUrl(uuidAmrToAmi)
    })

    it('Read download file', () => {
        cy.task('downloads', 'cypress/downloads').then(after => {
            console.log(after)
            cy.readFile("cypress/downloads/" + after).then(fileToRead => {
                cy.wrap(fileToRead).should('contain', '_AMR:inactive')
            })
        })
    })

    function generateUrl(uuid) {
        cy.log('UUID - ' + uuid)
        objGenericPage.userHashApiResponse(uuid, pilotData.pilotId).then((res) => {
            cy.log(res.payload)
            userHash = res.payload
            cy.visit(pilotData.url + "dashboard?user-hash=" + res.payload)
            objGenericPage.checkHeader()
            cy.wait(1000)
            objGenericPage.clickDownloadMyData()
            cy.wait(1000)
            invoiceResponse(uuid)
        })
    }

    function invoiceResponse(uuid) {
        cy.request({
            method: 'GET',
            url: baseUrl + '/billingdata/users/' + uuid + '/homes/1/utilitydata?t0=1&t1=1906986799&measurementType=ELECTRIC',
            headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                objLength = Object.keys(res).length
                cy.log(objLength)
                var isAmrUser = false
                var isAmiUser = false
                var checkOnceAmr = true
                var checkOnceAmi = true
                for (let index = 0; index < objLength; index++) {
                    const element = Object.keys(res)[index];
                    let firstObjData = res[element]
                    if (firstObjData['userType'] == 'AMR' && checkOnceAmr) {
                        cy.log('AMR meter')
                        isAmrUser = true
                        checkOnceAmr = false
                        let firstBillingStartTs = firstObjData['billingStartTs']
                        let firstBillingEndTs = firstObjData['billingEndTs']
                        let firstStartTs = new Date(firstBillingStartTs * 1000);
                        let firstEndTs = new Date(firstBillingEndTs * 1000);
                        firstEndTs.setDate(firstEndTs.getDate() - 1)
                        strMinStartDate = objGenericPage.changDateFormat(firstStartTs.toDateString())
                        strMinEndDate = objGenericPage.changDateFormat(firstEndTs.toDateString())

                        var billPeriodStartDateTwo = objGenericPage.changDateFormatString(strMinStartDate)
                        var billPeriodEndDateTwo = objGenericPage.changDateFormatString(strMinEndDate)
                        let strBillPeriodDate = billPeriodStartDateTwo + ' - ' + billPeriodEndDateTwo
                        cy.log(strBillPeriodDate)
                        objGbDownload.verifyPageTitle();
                        objGbDownload.verifySubtitle()
                        objGbDownload.verifyExportBillLabel()
                        objGbDownload.verifyExportDaysLabel()
                        objGbDownload.selectDropdownElement(strBillPeriodDate, objLength)
                        objGbDownload.clickExport()
                        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                        cy.wait(1000)
                        cy.contains('Export usage for range of days').click()
                        objGbDownload.enterFromDate(strMinStartDate)
                        objGbDownload.enterToDate(strMinEndDate)
                        objGbDownload.clickExport()
                        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                    }
                    else if (firstObjData['userType'] == 'GB' && checkOnceAmi) {
                        cy.log('AMI meter')
                        isAmiUser = true
                        checkOnceAmi = false
                        cy.reload()
                        let firstBillingStartTsAmi = firstObjData['billingStartTs']
                        let firstBillingEndTsAmi = firstObjData['billingEndTs']
                        let firstStartTsAmi = new Date(firstBillingStartTsAmi * 1000);
                        let firstEndTsAmi = new Date(firstBillingEndTsAmi * 1000);
                        firstEndTsAmi.setDate(firstEndTsAmi.getDate() - 1)
                        var strMinStartDateAmi = objGenericPage.changDateFormat(firstStartTsAmi.toDateString())
                        var strMinEndDateAmi = objGenericPage.changDateFormat(firstEndTsAmi.toDateString())

                        var billPeriodStartDateTwoAmi = objGenericPage.changDateFormatString(strMinStartDateAmi)
                        var billPeriodEndDateTwoAmi = objGenericPage.changDateFormatString(strMinEndDateAmi)
                        let strBillPeriodDateAmi = billPeriodStartDateTwoAmi + ' - ' + billPeriodEndDateTwoAmi
                        cy.log(strBillPeriodDateAmi)
                        objGbDownload.selectDropdownElement(strBillPeriodDateAmi, objLength)
                        objGbDownload.clickExport()
                        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                        cy.wait(1000)
                        cy.contains('Export usage for range of days').click()
                        objGbDownload.enterFromDate(strMinStartDateAmi)
                        objGbDownload.enterToDate(strMinEndDateAmi)
                        objGbDownload.clickExport()
                        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                    }
                }

                assert.isTrue(isAmrUser, 'AMR user not found')
                assert.isTrue(isAmiUser, 'AMI user not found')
            })
    }

    it("Navigate to Download my data & Export data - Validate Transition month data", () => {
        cy.log('UUID - ' + uuidTwo)
        objGenericPage.userHashApiResponse(uuidTwo, pilotData.pilotId).then((res) => {
            cy.log(res.payload)
            userHash = res.payload
            userHash = res.payload
            cy.visit(pilotData.url + "dashboard?user-hash=" + res.payload)
            objGenericPage.checkHeader()
            cy.wait(1000)
            objGenericPage.clickDownloadMyData()
            cy.wait(1000)
            cy.request({
                method: 'GET',
                url: baseUrl + '/billingdata/users/' + uuidTwo + '/homes/1/utilitydata?t0=1&t1=1906986799&measurementType=ELECTRIC',
                headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
            })
                .then((Response) => {
                    expect(Response.status).to.eq(200)
                    let res = Response.body
                    objLength = Object.keys(res).length
                    cy.log(objLength)
                    var i = 0;
                    for (let index = 0; index < objLength; index++) {
                        const element = Object.keys(res)[index];
                        let firstObjData = res[element]
                        if (firstObjData['userType'] == 'AMR') {
                            i = i + 1;
                            cy.log('AMR meter' + i)
                        }
                    }


                    cy.log('outside for loop')
                    var firstKey = Object.keys(res)[i];
                    let firstObjData = res[firstKey]
                    cy.log(firstObjData)
                    transitionBillingStartTs = firstObjData['billingStartTs']
                    transitionBillingEndTs = firstObjData['billingEndTs']
                    let firstStartTs = new Date(transitionBillingStartTs * 1000);
                    let firstEndTs = new Date(transitionBillingEndTs * 1000);
                    firstEndTs.setDate(firstEndTs.getDate() - 1)
                    strMinStartDate = objGenericPage.changDateFormat(firstStartTs.toDateString())
                    strMinEndDate = objGenericPage.changDateFormat(firstEndTs.toDateString())

                    var billPeriodStartDateTwo = objGenericPage.changDateFormatString(strMinStartDate)
                    var billPeriodEndDateTwo = objGenericPage.changDateFormatString(strMinEndDate)
                    let strBillPeriodDate = billPeriodStartDateTwo + ' - ' + billPeriodEndDateTwo
                    cy.log(strBillPeriodDate)
                    objGbDownload.verifyPageTitle();
                    objGbDownload.selectDropdownElement(strBillPeriodDate, objLength)
                    objGbDownload.clickExport()
                    objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                    cy.wait(1000)
                })
        })
    })

    it('Fetch values from RAW data - AMI data', () => {
        cy.request({
            method: 'GET',
            url: baseUrl + '/streams/users/' + uuidTwo + '/homes/1/gws/2/meters/1/gb.json?t0=' + transitionBillingStartTs + '&t1=' + transitionBillingEndTs,
            headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                cy.log(res)
                for (let index = 0; index < 5; index++) {
                    const element = res[index];
                    console.log(element)
                    const time = element['time']
                    var value = element['value']
                    const duration = element['duration']
                    value = Math.round(value)
                    cy.log(value)
                    strObj = strObj + '<espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>' + duration + '</espi:duration><espi:start>' + time + '</espi:start></espi:timePeriod><espi:value>' + value + '</espi:value></espi:IntervalReading>'
                }
            })
    })

    it('Fetch values from RAW data - AMR data', () => {
        cy.request({
            method: 'GET',
            url: baseUrl + '/streams/users/' + uuidTwo + '/homes/1/gws/3/meters/1/gb.json?t0=' + transitionBillingStartTs + '&t1=' + transitionBillingEndTs,
            headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
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
                    strObjTwo = '<espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>' + duration + '</espi:duration><espi:start>' + time + '</espi:start></espi:timePeriod><espi:value>' + value + '</espi:value></espi:IntervalReading>'
                    arrValues.push(strObjTwo)
                    // console.log(strObj)

                }
            })
    })

    it('Read download file - Transition data', () => {
        cy.task('downloads', 'cypress/downloads').then(after => {
            console.log(strObj)
            cy.readFile("cypress/downloads/" + after).then(fileToRead => {
                cy.wrap(fileToRead).should('contain', strObj)
                for (let index = 0; index < arrValues.length; index++) {
                    const element = arrValues[index];
                    console.log(element)
                    cy.wrap(fileToRead).should('contain', element)
                }
            })
        })
    })

})