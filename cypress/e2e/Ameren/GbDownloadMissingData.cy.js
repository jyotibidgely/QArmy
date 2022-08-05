import GBDownload from "../../pageObjects/GBDownload"
import genericPage from "../../pageObjects/genericPage"

describe("GB download", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    let objLength
    var strMinStartDate
    var strMinEndDate
    const uuid1BC = '91b88225-e17a-4778-b0c3-13cd0dd6f99d'
    const uuidNoRaw = '53fe484b-f702-4c73-9779-c04aa9c6d100'
    const uuid1Raw = 'b088ba64-0738-4768-b990-2cee740a36c3'
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
        generateUrl(uuid1BC)
    })

    it("Navigate to Download my data & Export data - No Raw", () => {
        generateUrl(uuidNoRaw)
    })

    it("Navigate to Download my data & Export data - One Raw", () => {
        generateUrl(uuid1Raw)
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
                cy.log(res)

                let objFirst = Object.keys(res)[0]
                let firstObjData = res[objFirst]
                let firstBillingStartTs = firstObjData['billingStartTs']
                let firstBillingEndTs = firstObjData['billingEndTs']
                let firstStartTs = new Date(firstBillingStartTs * 1000);
                let firstEndTs = new Date(firstBillingEndTs * 1000);
                firstEndTs.setDate(firstEndTs.getDate() - 1)
                strMinStartDate = objGenericPage.changDateFormat(firstStartTs.toDateString())
                strMinEndDate = objGenericPage.changDateFormat(firstEndTs.toDateString())

                objGenericPage.checkHeader()
                cy.wait(1000)
                objGenericPage.clickMenuBtn()
                cy.wait(1000)
                cy.get('.MuiList-root > [href="/dashboard/gb-download"]').click()
                cy.wait(1000)
                var billPeriodStartDateTwo = objGenericPage.changDateFormatString(strMinStartDate)
                var billPeriodEndDateTwo = objGenericPage.changDateFormatString(strMinEndDate)
                let strBillPeriodDate = billPeriodStartDateTwo + ' - ' + billPeriodEndDateTwo
                cy.log(strBillPeriodDate)
                objGbDownload.verifyPageTitle();
                objGbDownload.verifySubtitle()
                objGbDownload.verifyExportBillLabel()
                objGbDownload.verifyExportDaysLabel()
                cy.get(objGbDownload.dropdownEle).click()
                cy.get(objGbDownload.dropdownList).last().should('have.text', strBillPeriodDate).click()
                objGbDownload.clickExport()
                objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
            })
    }
})