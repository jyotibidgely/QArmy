import EnergyInsights from "../../../pageObjects/EnergyInsights"
import Faqs from "../../../pageObjects/Faqs"
import genericPage from "../../../pageObjects/genericPage"
import HomePage from "../../../pageObjects/HomePage"
import Recommedations from "../../../pageObjects/Recommedations"
import Survey from "../../../pageObjects/Survey"

describe("Accessibility Testing - AMR Dual fuel", () => {
    const objGenericPage = new genericPage()
    const objHomepage = new HomePage()
    const objInsightsPage = new EnergyInsights()
    const objRecoPage = new Recommedations()
    const objFaq = new Faqs()
    const objSurvey = new Survey()
    const uuid = '25d9ebfe-d327-47c1-8c60-0a8e5adc8ab3'
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    var hash

    before(function () {
        cy.getAccessToken().then((token) => {
            cy.log(token)
            objGenericPage.userHashApiResponse(uuid, pilotData.pilotId).then((res) => {
                cy.log(res.payload)
                hash = res.payload
                cy.visit(pilotData.url + "dashboard?user-hash=" + hash)
                objGenericPage.selectFuelType('Electric')
                cy.injectAxe();
            })
        })
    })

    it("Check homepage - Electric", () => {
        homepage('Electric')

    })

    it("Check Energy Insights - Electric", () => {
        energyInsights('Electric')
    })

    it("Check My Recommedations - Electric", () => {
        recommendations('Electric')
    })

    it("Check FAQs - Electric", () => {
        faq('Electric')
    })

    it("Check Survey - Electric", () => {
        survey('Electric')
    })

    it("Check homepage - Gas", () => {
        cy.visit(pilotData.url + "dashboard?user-hash=" + hash)
        objGenericPage.selectFuelType('Gas')
        cy.injectAxe();
        homepage('Gas')
    })

    it("Check Energy Insights - Gas", () => {
        energyInsights('Gas')
    })

    it("Check My Recommedations - Gas", () => {
        recommendations('Gas')
    })

    it("Check FAQs - Gas", () => {
        faq('Gas')
    })

    it("Check Survey - Gas", () => {
        survey('Gas')
    })

    function homepage(strFuel) {
        objGenericPage.checkHeader()
        objGenericPage.loadingScreenIndicator()
        objGenericPage.checkFuelLabel(strFuel)
        objHomepage.homePageLoaded()
        objGenericPage.loadingScreenIndicator()
        cy.wait(3000)
        cy.customCheckAlly();
    }

    function energyInsights(strFuel) {
        cy.get('body').tab().tab().tab().tab().should('have.text', 'Energy Insights')
        cy.focused().children().type('{enter}')
        // objGenericPage.clickNavBarTabs('ENERGY_INSIGHTS')
        objInsightsPage.insightsPageLoaded()
        objGenericPage.checkFuelLabel(strFuel)
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    }

    function recommendations(strFuel) {
        cy.focused().tab().should('have.text', 'My Recommendations')
        cy.focused().children().type('{enter}')
        // objGenericPage.clickNavBarTabs('MY_RECOMMENDATIONS')
        objRecoPage.recommedationsPageLoaded()
        objGenericPage.checkFuelLabel(strFuel)
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    }

    function faq(strFuel) {
        cy.get('body').tab().tab().tab().tab().tab().tab().tab().should('have.text', 'FAQs')
        cy.focused().children().type('{enter}')
        // objGenericPage.clickNavBarTabs('FAQS')
        objFaq.faqPageLoaded()
        objGenericPage.checkFuelLabel(strFuel)
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    }

    function survey(strFuel) {
        cy.focused().tab({ shift: true }).should('have.text', 'Survey')
        cy.focused().children().type('{enter}')
        // objGenericPage.clickNavBarTabs('SURVEY')
        objSurvey.surveyPageLoaded()
        objGenericPage.checkFuelLabel(strFuel)
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    }

})