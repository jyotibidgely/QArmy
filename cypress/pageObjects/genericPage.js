class genericPage {
    headerContainer = '.app-bar-container'
    hamburgerMenuBtn = '.hamburger-menu button'

    checkHeader() {
        cy.get(this.headerContainer, { timeout: 30000 }).should('be.visible')
    }

    clickMenuBtn() {
        cy.get(this.hamburgerMenuBtn).click()
    }

    changDateFormat(current_datetime) {
        const moment = require('moment');
        var dateString = moment(current_datetime).format("MM/DD/YYYY");
        console.log(dateString)
        return dateString
    }
}

export default genericPage;