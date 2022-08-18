class Survey {

    surveyPageEle = '.survey-page-main'

    surveyPageLoaded() {
        cy.get(this.surveyPageEle, {timeout:10000}).should('be.visible')
    }
}

export default Survey;