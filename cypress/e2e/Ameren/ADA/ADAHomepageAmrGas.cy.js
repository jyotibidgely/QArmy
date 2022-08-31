import ApiResponse from "../../../pageObjects/ApiResponse"
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
    const objApiResponse = new ApiResponse()
    const uuid = '0bafb523-97a6-4a54-8002-201e3c5db87d'
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    var measurementType = 'GAS'
    var arrEnergyData = []

    before(function () {
        cy.getAccessToken().then((token) => {
            cy.log(token)
            objGenericPage.userHashApiResponse(uuid, pilotData.pilotId).then((res) => {
                cy.log(res.payload)
                cy.intercept({ method: 'GET', url: '/v2.0/dashboard/users/' + uuid + '/itemization-widget-data?measurement-type=' + measurementType + '&date-format=MONTH_IN_WORDS_SPACE_DAY_COMMA_YEAR&locale=en_US' }).as('itemizationDataRes')
                cy.visit(pilotData.url + "dashboard?user-hash=" + res.payload)
                cy.injectAxe();
                cy.wait('@itemizationDataRes', { timeout: 10000 }).should(({ request, response }) => {
                    expect(response.statusCode).to.eq(200)
                    arrEnergyData = response.body.payload.itemizationDetails.gas
                    cy.log(arrEnergyData)
                })
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
        // cy.get('body').tab().tab().tab().tab().tab().tab().tab().tab().tab().tab()
        // objHomepage.energyChartAccessibility('{rightarrow}')

        // objHomepage.energyChartAccessibility('{downarrow}')

        for (let index = 0; index < arrEnergyData.length; index++) {
            const element = arrEnergyData[index];
            var cost = element['cost']
            cost = Math.round(cost)
            var strCost = cost.toString()
            var category = element['category']
            var sentence = category.toLowerCase().split(" ");
            for (var i = 0; i < sentence.length; i++) {
                sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
                cy.log(sentence)
            }
            var strAppliance = ' '+sentence + ': ' + '$' + strCost 
            if (index == 0) {
                cy.get('body').tab().tab().tab().tab().tab().tab().tab().tab().tab().tab()
                cy.get(objHomepage.energyChartTooltipText).should('have.text', strAppliance)
            } else {
                cy.focused().type('{rightarrow}')
                cy.get(objHomepage.energyChartTooltipText).should('contain.text', sentence)
                cy.get(objHomepage.energyChartTooltipText).should('contain.text', ': ' + '$' + strCost)
            }
        }
        
    })

    it("Check homepage - Energy chart", () => {
        for (let index = 0; index < arrEnergyData.length; index++) {
            const element = arrEnergyData[index];
            var cost = element['cost']
            cost = Math.round(cost)
            var strCost = cost.toString()
            var category = element['category']
            var sentence = category.toLowerCase().split(" ");
            for (var i = 0; i < sentence.length; i++) {
                sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
                cy.log(sentence)
            }
            var strAppliance = '$' + strCost + ' ' + sentence
            if (index == 0) {
                cy.get('body').tab().invoke('attr', 'aria-label').should('contain', strAppliance)
            } else {
                cy.focused().type('{downarrow}').focused().invoke('attr', 'aria-label').should('contain', strAppliance)
            }
        }

        cy.get('body').tab().tab().tab().tab().tab().tab().tab().tab().tab().tab().tab()
        cy.focused().parent().parent().parent().tab().tab().invoke('attr', 'href').should('eq', '/dashboard/faqs')
        cy.focused().tab().should('have.text', 'Home Survey').type('{enter}')
        cy.focused().click()
        // cy.focused().tab({shift: true}).type('{enter}')
    })

})