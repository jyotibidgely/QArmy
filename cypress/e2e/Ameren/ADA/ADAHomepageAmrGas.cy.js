import EnergyInsights from "../../../pageObjects/EnergyInsights"
import Faqs from "../../../pageObjects/Faqs"
import genericPage from "../../../pageObjects/genericPage"
import HomePage from "../../../pageObjects/HomePage"
import Recommedations from "../../../pageObjects/Recommedations"
import Survey from "../../../pageObjects/Survey"

describe("Accessibility Testing - AMR Gas", () => {
    const objGenericPage = new genericPage()
    const objHomepage = new HomePage()
    const objInsightsPage = new EnergyInsights()
    const objRecoPage = new Recommedations()
    const objFaq = new Faqs()
    const objSurvey = new Survey()
    const uuid = '0bafb523-97a6-4a54-8002-201e3c5db87d'
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)

    before(function () {
        cy.getAccessToken().then((token) => {
            cy.log(token)
            objGenericPage.userHashApiResponse(uuid, pilotData.pilotId).then((res) => {
                cy.log(res.payload)
                cy.visit(pilotData.url + "dashboard?user-hash=" + res.payload)
                cy.injectAxe();
            })
        })
    })

    it("Check homepage - Accessibility Icon", () => {
        objGenericPage.checkHeader()
        objHomepage.homePageLoaded()
        objGenericPage.loadingScreenIndicator()
        cy.wait(3000)
        cy.get('body').tab().tab().tab().tab().tab().tab().tab().tab().tab().children().type('{enter}')
        cy.wait(200)
        cy.customCheckAllyElement('.chart-modal-wrapper');
        cy.focused().tab().parent().invoke('attr', 'class').should('eq', 'consumption-chart-table ')
        cy.focused().tab().invoke('attr', 'href').should('eq', '/dashboard/faqs')
        cy.focused().tab().should('have.text', 'Home Survey')
        cy.focused().tab().invoke('attr', 'class').should('eq', 'bidgely-icon-cancel-circle')
        objGenericPage.clickCancelIcon()
    })

    it("Check homepage - Energy chart", () => {
        cy.get('body').tab().tab().tab().tab().tab().tab().tab().tab().tab().tab()
        objHomepage.energyChartAccessibility('{rightarrow}')

        cy.get('body').tab()
        objHomepage.energyChartAccessibility('{downarrow}')

        cy.get('body').tab().tab().tab().tab().tab().tab().tab().tab().tab().tab().tab()
        cy.focused().parent().parent().parent().tab().tab().invoke('attr', 'href').should('eq', '/dashboard/faqs')
        cy.focused().tab().should('have.text', 'Home Survey')
    })
})