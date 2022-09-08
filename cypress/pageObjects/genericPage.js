class genericPage {
    headerNav = 'header[role="navigation"]'
    headerContainer = '.app-bar-container'
    navBarTab = '[data-menu-id="%s"]'
    homeTab = '[data-menu-id="HOME"]'
    energyInsightsTab = '[data-menu-id="ENERGY_INSIGHTS"]'
    myRecommedationsTab = '[data-menu-id="MY_RECOMMENDATIONS"]'
    surveyTab = '[data-menu-id="SURVEY"]'
    faqsTab = '[data-menu-id="FAQS"]'
    hamburgerMenuBtn = '.hamburger-menu button'
    navMenuList = '.nav-menu-list'
    hamburgerMenuItem = 'a'
    fuelTypeContainer = '.fuel-type-selection-container'
    loadingIndicator = '.loading-screen > img'
    fuelMenuBtn = '.fuel-menu button'
    fuelTypeList = 'ul.fuel-type-list li'
    fuelLabel = '.fuel-label'
    gasFuelIcon = '.icon-left.bidgely-icon-gas'
    electricFuelIcon = '.icon-left.bidgely-icon-electric'
    modalCancelIcon = '.bidgely-icon-cancel-circle'

    checkHeader() {
        cy.get(this.headerContainer, { timeout: 30000 }).should('be.visible')
    }

    clickNavBarTabs(strTab) {
        var ele = this.navBarTab.replace(/%s/, strTab)
        cy.log(ele)
        cy.get(this.headerContainer, {timeout:10000}).find(ele).click()
    }

    clickMenuBtn() {
        cy.get(this.hamburgerMenuBtn).click()
    }

    clickDownloadMyData() {
        cy.get(this.hamburgerMenuBtn).click()
        cy.get(this.navMenuList).find(this.hamburgerMenuItem).contains('Green Button Download').click()
        // cy.wait(2000)
        // cy.title().should('eq', 'Download my data')
    }

    selectFuelType(strFuelType) {
        cy.get(this.fuelTypeContainer, { timeout: 20000 }).contains(strFuelType).click()
    }

    checkFuelLabel(strFuelType) {
        cy.get(this.fuelLabel, {timeout:30000}).should('have.text', strFuelType)
    }

    clickCancelIcon() {
        cy.get(this.modalCancelIcon).click()
    }

    loadingScreenIndicator() {
        cy.wait(1000)
        cy.get(this.loadingIndicator, { timeout: 30000 }).should('not.exist')
    }

    changDateFormat(current_datetime) {
        const moment = require('moment');
        var dateString = moment(current_datetime).format("MM/DD/YYYY");
        console.log(dateString)
        return dateString
    }

    changDateFormatString(current_datetime) {
        const moment = require('moment');
        var dateString = moment(current_datetime).format("MMM D, YYYY");
        console.log(dateString)
        return dateString
    }

    selectFuelTypeUsingMenuButton(strFuelType) {
        cy.get(this.fuelMenuBtn).click()
        cy.get(this.fuelTypeList).contains(strFuelType).click()
    }

    //User Hash Api//
    userHashApiResponse(uuid, pilotId) {
        return cy.request({
            method: 'GET',
            url: Cypress.env('baseURL') + '/v2.0/user-auth/cipher?user-id=' + uuid + '&pilot-id=' + pilotId, timeout: 30000
        }).then((Response) => {
            expect(Response.status).to.eq(200)
            let res = Response.body
            return res
        })
    }
}

export default genericPage;