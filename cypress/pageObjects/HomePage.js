class HomePage {

    homepageEle = '.home-page-main'

    homePageLoaded() {
        cy.get(this.homepageEle, {timeout:10000}).should('be.visible')
    }
}

export default HomePage;