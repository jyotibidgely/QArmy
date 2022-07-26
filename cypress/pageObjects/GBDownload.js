class GBDownload {

    pageTitle = '.download-page-title .title'
    subTitle = '.download-page-sub-title'
    exportBillPeriodLbl = '.gb-download-dropdown > .MuiFormControlLabel-root > .MuiTypography-root'
    exportDaysLbl = '.MuiFormGroup-root > :nth-child(2) > :nth-child(1) .MuiFormControlLabel-label'
    dataMsg = '.data-format-msg'
    dropdownEle = '.MuiSelect-root'
    dropdownList = '#menu- > .MuiPaper-root > .MuiList-root li'
    exportBtn = '.download-page-btn.gb-export-btn'
    gbDownloadMsg = '.gb-download-msg'


    verifyPageTitle() {
        cy.get(this.pageTitle, {timeout:10000}).should('have.text', 'Download my data')
    }

    verifySubtitle() {
        cy.get(this.subTitle).should('have.text', 'Select the time period:')
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

    selectDropdownElement() {
        cy.get(this.dropdownEle).click()
        cy.get(this.dropdownList).eq(4).click()
    }

    clickExport() {
        cy.get(this.exportBtn,{timeout:10000}).click()
    }

    checkSuccessMsg() {
        cy.get(this.gbDownloadMsg,{timeout:10000}).should('have.text', 'GreenButton data downloaded successfully.')
    }
}

export default GBDownload;