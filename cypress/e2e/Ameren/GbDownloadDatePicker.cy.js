import GBDownload from "../../pageObjects/GBDownload"
import genericPage from "../../pageObjects/genericPage"

describe("GB download - Date picker", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    let objLength
    var strMinStartDate
    var strMinEndDate
    const uuidAMRSolar = 'f9d041f9-ff10-42c7-a10a-82b066b249a0'
    const uuidAMISolar = '2ed5382d-59a2-4571-8654-ae04f2c4cd69'
    const uuidAMREToAMRS = 'ed720f86-8c63-4686-9736-5c1b784b6ca8'
    const uuidAMIEToAMIS = '7a55d084-2c48-4784-a08d-d6c0b3e5d470'
    const uuidAMRToAMISolar = 'd372521c-543d-4f51-802a-96938b7b5158'
    const uuidNegativeValuesInvoice = '95e62c50-3c50-4a72-8fe1-5502367bfacc'
    const uuidZeroConsumption = '5a059e56-f477-4d7f-85de-1a7b06b337e7'
    const uuidOverlappingBcOne = '581da838-8e14-42c9-b18c-17dacaf069a3'
    const uuidOverlappingBcTwo = '6f398be6-de38-4dcc-a27c-04d4635559f8'
    const uuidShorterBc = '6f398be6-de38-4dcc-a27c-04d4635559f8'
    const uuidAmrE = '4b315c75-64f1-4b04-bc92-c64825a9cb0b'
    const uuidAmiE = '56ecde20-b0d3-42e9-9a65-5ea4d6adebb8'
    const uuidNoInvoice = '193155f8-c2af-4bdf-a749-c4dee1254012'
    const uuidAmrAmiHistData = 'efdd88eb-d301-43fa-8649-e1dcf8039ed0'
    var bearerToken
    var userHash
    var baseUrl = Cypress.env('baseURL')

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.log(bearerToken)
        })
    })

    it("Navigate to Download my data & Export data - AMR Solar", () => {
        generateUrl(uuidAMRSolar)
    })

    it("Navigate to Download my data & Export data - AMI Solar", () => {
        generateUrl(uuidAMISolar)
    })

    it("Navigate to Download my data & Export data - AMR E to AMR Solar", () => {
        generateUrl(uuidAMREToAMRS)
    })

    it("Navigate to Download my data & Export data - AMI E to AMI Solar", () => {
        generateUrl(uuidAMIEToAMIS)
    })

    it("Navigate to Download my data & Export data - AMR to AMI Solar", () => {
        generateUrl(uuidAMRToAMISolar)
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
                // invoiceResponse(uuid)
                objGenericPage.checkHeader()
                cy.wait(1000)
                objGenericPage.clickDownloadMyData()
                cy.wait(500)
                objGenericPage.loadingScreenIndicator()
                cy.wait(1000)
                cy.contains('Export usage for range of days').click()
                cy.wait(1000)
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