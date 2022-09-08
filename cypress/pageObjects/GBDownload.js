class GBDownload {

    pageTitle = '.download-page-title .title'
    subTitle = '.download-page-sub-title'
    exportBillPeriodLbl = '.gb-download-dropdown > .MuiFormControlLabel-root > .MuiTypography-root'
    exportDaysLbl = '.MuiFormGroup-root > :nth-child(2) > :nth-child(1) .MuiFormControlLabel-label'
    dataMsg = '.data-format-msg'
    dropdownEle = '.MuiSelect-root'
    dropdownList = '#menu- > .MuiPaper-root > .MuiList-root li'
    exportBtn = '.download-page-btn.gb-export-btn'
    downloadPageBtn = '.download-page-btn'
    gbDownloadMsg = '.gb-download-msg'
    fromDate = '[name="From"]'
    toDate = '[name="To"]'
    validationMsg = 'p.Mui-error'
    calendarIcon = '.bidgely-icon-calendar'


    verifyPageTitle() {
        cy.get(this.pageTitle, { timeout: 10000 }).should('have.text', 'Green Button Download')
    }

    verifySubtitle() {
        cy.get(this.subTitle, { timeout: 10000 }).should('have.text', 'Select the time period:')
    }

    verifyExportBillLabel() {
        cy.get(this.exportBillPeriodLbl).should('have.text', 'Export usage for range of bill period')
    }

    verifyExportDaysLabel() {
        cy.get(this.exportDaysLbl).should('have.text', 'Export usage for range of days')
    }

    verifyDataMsg() {
        cy.get(this.dataMsg).should('have.text', 'Data will be downloaded in a xml file.')
    }

    selectDropdownElement(strDate, intLength) {
        cy.get(this.dropdownEle).click()
        cy.get(this.dropdownList).should('have.length', intLength)
        cy.get(this.dropdownList).contains(strDate).click()
    }

    clickExport() {
        cy.get(this.exportBtn, { timeout: 10000 }).click()
    }

    clickCancelBtn() {
        cy.get(this.downloadPageBtn).contains('Cancel').click()
    }

    checkSuccessMsg(successMsg) {
        cy.get(this.gbDownloadMsg, { timeout: 10000 }).should('have.text', successMsg)
    }

    enterFromDate(strFromDate) {
        cy.get(this.fromDate).clear().type(strFromDate)
    }

    enterToDate(strToDate) {
        cy.get(this.toDate).clear().type(strToDate)
    }

    checkErrorMsg(errorMsg) {
        cy.get(this.validationMsg).should('have.text', errorMsg)
    }
}

export default GBDownload;