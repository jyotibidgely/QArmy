import GBDownload from "../../../pageObjects/GBDownload"
import genericPage from "../../../pageObjects/genericPage"

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
    const uuidAMISToNS = 'e2baf3f8-ee74-4667-9a43-276ea090edfc'
    const uuidAMINSToS = '31e1d460-aa17-48b7-aab5-7900aed184c2'
    const uuidTwelveMonths = '00fb4a7d-77b6-4667-b39d-4a420b2638e5'
    var bearerToken
    var userHash
    var baseUrl = Cypress.env('baseURL')

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.log(bearerToken)
        })
    })

    beforeEach(() => {
        cy.log('beforeEach')
        cy.deleteDownloadsFolder()
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

    it("Navigate to Download my data & Export data - AMI Solar to AMI NonSolar", () => {
        generateUrl(uuidAMISToNS)
    })

    it("Navigate to Download my data & Export data - AMI NonSolar to AMI Solar", () => {
        generateUrl(uuidAMINSToS)
    })

    it("Navigate to Download my data & Export data - 365 Days data", () => {
        generateUrl(uuidTwelveMonths)
        cy.contains('Export usage for range of bill period').click()
        cy.get(objGbDownload.dropdownEle).click()
        // cy.get(objGbDownload.dropdownList).should('have.length', 12)    
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
                cy.wait(2000)
                cy.task('downloads', 'cypress/downloads').then(after => {
                    expect(after.length).to.be.eq(1)
                })
            })
    }

})