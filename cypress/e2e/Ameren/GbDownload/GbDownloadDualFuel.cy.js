import GBDownload from "../../../pageObjects/GBDownload"
import genericPage from "../../../pageObjects/genericPage"

describe("GB download - Date picker", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    const uuidDualAMREG = '896eed18-4088-460e-a97b-cf2b7921d8e1'
    var bearerToken

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.log(bearerToken)
        })
    })

    it("Navigate to Download my data & Export data - AMR E + G", () => {
        generateUrl(uuidDualAMREG, 'Electric')
        generateUrl(uuidDualAMREG, 'Gas')
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