class Faqs {

    faqPageEle = '.disagg101-main'

    faqPageLoaded() {
        cy.get(this.faqPageEle, {timeout:10000}).should('be.visible')
    }
}

export default Faqs;