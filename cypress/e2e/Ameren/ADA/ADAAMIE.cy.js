import EnergyInsights from "../../../pageObjects/EnergyInsights"
import Faqs from "../../../pageObjects/Faqs"
import genericPage from "../../../pageObjects/genericPage"
import HomePage from "../../../pageObjects/HomePage"
import Recommedations from "../../../pageObjects/Recommedations"
import Survey from "../../../pageObjects/Survey"

describe("Accessibility Testing - AMI Electric", () => {
    const objGenericPage = new genericPage()
    const objHomepage = new HomePage()
    const objInsightsPage = new EnergyInsights()
    const objRecoPage = new Recommedations()
    const objFaq = new Faqs()
    const objSurvey = new Survey()
    const uuid = '00fb4a7d-77b6-4667-b39d-4a420b2638e5'
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

    it("Check homepage", () => {
        objGenericPage.checkHeader()
        objHomepage.homePageLoaded()
        objGenericPage.loadingScreenIndicator()
        cy.wait(3000)
        // first a11y test
        cy.customCheckAlly();
    })

    it("Check Energy Insights", () => {
        objGenericPage.clickNavBarTabs('ENERGY_INSIGHTS')
        objInsightsPage.insightsPageLoaded()
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        let arrEle = [[objGenericPage.headerNav], ['.view-tab.ada-accessibility.MuiTab-root:nth-child(2) > .MuiTab-wrapper']]
        cy.customCheckAllyExclude([objGenericPage.headerNav]);

        objInsightsPage.clickInsightMainTabs('Appliance')
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
        objInsightsPage.clickInsightMainTabs('Cost')
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
        objInsightsPage.clickInsightMainTabs('Usage')
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);

        objInsightsPage.clickInsightTabs('Monthly Summary')
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
        objInsightsPage.clickInsightTabs('Similar Homes')
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
        objInsightsPage.clickInsightTabs('Bill Analysis')
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
        objInsightsPage.clickInsightTabs('Rate Plan Options')
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    })

    it("Check My Recommedations", () => {
        objGenericPage.clickNavBarTabs('MY_RECOMMENDATIONS')
        objRecoPage.recommedationsPageLoaded()
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    })

    it("Check FAQs", () => {
        objGenericPage.clickNavBarTabs('FAQS')
        objFaq.faqPageLoaded()
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    })

    it("Check Survey", () => {
        objGenericPage.clickNavBarTabs('SURVEY')
        objSurvey.surveyPageLoaded()
        cy.wait(500)
        objGenericPage.loadingScreenIndicator()
        cy.wait(2000)
        cy.customCheckAllyExclude([objGenericPage.headerNav]);
    })
})