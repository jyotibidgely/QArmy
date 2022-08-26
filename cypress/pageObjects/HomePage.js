class HomePage {

    homepageEle = '.home-page-main'
    energyBreakdownSection = '.app-breakdown-container'
    energyBreakdownHeaderSection = '.app-breakdown-header-container'

    homePageLoaded() {
        cy.get(this.homepageEle, {timeout:10000}).should('be.visible')
    }

    //ADA
    energyChartAccessibility(strKey) {
        cy.get('.highcharts-a11y-proxy-button').each(($el, index, $list) => {
            cy.focused().type(strKey)
            cy.log(index)
        })
    }
}

export default HomePage;