import GBDownload from "../../pageObjects/GBDownload"
import genericPage from "../../pageObjects/genericPage"

describe("GB download - AMR To AMI Electric", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    let objLength
    var strMinStartDate
    var strMinEndDate
    const uuidAmrToAmi = 'efdd88eb-d301-43fa-8649-e1dcf8039ed0'
    var bearerToken
    var userHash
    var baseUrl = Cypress.env('baseURL')

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
        cy.request({
            method: 'GET',
            url: baseUrl + '/v2.0/user-auth/cipher?user-id=' + uuid + '&pilot-id=' + pilotData.pilotId,
            headers: { 'Authorization': 'Bearer ' + bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
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
})