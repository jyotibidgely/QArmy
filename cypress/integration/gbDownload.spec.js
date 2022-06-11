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
    it("Upload data", () => {
        cy.visit("https://dmdvalidator.greenbuttonalliance.org/")
        cy.get('#FBSelection',{timeout:10000}).should('be.visible')
        cy.get('select').select('Energy Usage file: Electricity Interval Metering')
        cy.wait(200)
        cy.get('#FB_15').uncheck({force:true})
        cy.wait(500)
        //file to be uploaded path in project folder
        const p = 'UsageData-05-13-2022.xml'
        //upload file with attachFile
        cy.get('#dropZone')
        .attachFile(p, { subjectType: 'drag-n-drop' });
        cy.get(':nth-child(6) > thead > tr > td', {timeout:15000}).should('have.text', ' ...all tests were successful.')

    })
})