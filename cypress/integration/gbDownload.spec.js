describe("GB download", () => {
    it("Download my data", () => {
        cy.visit("https://nsp-uat.bidgely.com/dashboard/insights/monthly-summary?user-hash=1633088930681v1ZHPIZWp1inkItirOPVBMHdtVXNtTUqvfYzmqVsmSfwyVDY-UEZx0FBrdpVRKH7Yv9Nof-sRKypDk2kXkrqVo5A%3D%3D&linktype=EMAIL_UPDATE_HOME_PROFILE&event-type=MONTHLY_SUMMARY&ref=MONTHLY_SUMMARY&delivery-mode=Email&fuel-type=ELECTRIC")
        cy.get('.app-bar-container', { timeout: 20000 }).should('be.visible')
        cy.wait(1000)
        cy.get('.hamburger-menu button').click()
        cy.wait(1000)
        cy.get('.MuiList-root > [href="/dashboard/gb-download"]').click()
        cy.get('.download-page-btn.gb-export-btn',{timeout:10000}).click()
        cy.get('.gb-download-msg',{timeout:10000}).should('have.text', 'GreenButton data downloaded successfully.')
    })
})