class Recommedations {

    recoPageEle = '.reco-page-main'

    recommedationsPageLoaded() {
        cy.get(this.recoPageEle, {timeout:10000}).should('be.visible')
    }
}

export default Recommedations;