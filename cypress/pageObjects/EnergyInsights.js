class EnergyInsights {

    insightPageEle = '.insights-main-content'
    insightTabs = '.MuiPaper-root > .MuiTabs-root button'
    insightsMainTabs = '.main-controls button'
    insightSubTabs = '.sub-controls button'

    insightsPageLoaded() {
        cy.get(this.insightPageEle, {timeout:10000}).should('be.visible')
    }

    clickInsightTabs(btnTitle) {
        cy.get(this.insightTabs).contains(btnTitle).click()
    }

    clickInsightMainTabs(btnTitle) {
        cy.get(this.insightsMainTabs).contains(btnTitle).click()
    }

    clickInsightSubTabs(btnTitle) {
        cy.get(this.insightSubTabs).contains(btnTitle).click()
    }
}

export default EnergyInsights;