class Survey {

    surveyPageEle = '.survey-page-main'
    surveyOptions = '.survey-options-container div'
    surveyButtons = '.survey-buttons button'
    sliderTitle = '.survey-progress-slider-title'

    surveyPageLoaded() {
        cy.get(this.surveyPageEle, {timeout:10000}).should('be.visible')
    }

    selectSurveyOption(index) {
        cy.get(this.surveyOptions).eq(index).click()
    }

    clickSurveyButton(strBtn) {
        cy.get(this.surveyButtons).contains(strBtn).click()
    }
    
}

export default Survey;