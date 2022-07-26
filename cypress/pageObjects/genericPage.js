class genericPage {
    headerContainer = '.app-bar-container'
    hamburgerMenuBtn = '.hamburger-menu button'

    checkHeader() {
        cy.get(this.headerContainer, { timeout: 30000 }).should('be.visible')
    }

    clickMenuBtn() {
        cy.get(this.hamburgerMenuBtn).click()
    }
}

export default genericPage;