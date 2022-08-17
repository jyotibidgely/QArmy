class EnergyInsights {

    insightPageEle = '.insights-main-content'

    insightsPageLoaded() {
        cy.get(this.insightPageEle, {timeout:10000}).should('be.visible')
    }
}

export default EnergyInsights;