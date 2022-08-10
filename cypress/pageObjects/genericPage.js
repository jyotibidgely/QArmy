class genericPage {
    headerContainer = '.app-bar-container'
    hamburgerMenuBtn = '.hamburger-menu button'
    navMenuList = '.nav-menu-list'
    hamburgerMenuItem = 'a'
    fuelTypeContainer = '.fuel-type-selection-container'
    loadingIndicator = '.loading-screen > img'

    checkHeader() {
        cy.get(this.headerContainer, { timeout: 30000 }).should('be.visible')
    }

    clickMenuBtn() {
        cy.get(this.hamburgerMenuBtn).click()
    }

    clickDownloadMyData() {
        cy.get(this.hamburgerMenuBtn).click()
        cy.get(this.navMenuList).find(this.hamburgerMenuItem).contains('Download my data').click()
        // cy.wait(2000)
        // cy.title().should('eq', 'Download my data')
    }

    selectFuelType(strFuelType) {
        cy.get(this.fuelTypeContainer, { timeout: 20000 }).contains(strFuelType).click()
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

    //User Hash Api//
    userHashApiResponse(uuid, pilotId) {
        return cy.getAccessToken().then((token) => {
            return cy.request({
                method: 'GET',
                url: Cypress.env('baseURL') + '/v2.0/user-auth/cipher?user-id=' + uuid + '&pilot-id=' + pilotId,
                headers: { 'Authorization': 'Bearer ' + token }, timeout: 30000
            }).then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                return res
            })
        })
    }
}

export default genericPage;