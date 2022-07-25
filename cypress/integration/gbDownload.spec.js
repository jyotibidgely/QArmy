describe("GB download", () => {
    it("Download my data", () => {
        // cy.visit("https://nsp-uat.bidgely.com/dashboard/insights/monthly-summary?user-hash=1633088930681v1ZHPIZWp1inkItirOPVBMHdtVXNtTUqvfYzmqVsmSfwyVDY-UEZx0FBrdpVRKH7Yv9Nof-sRKypDk2kXkrqVo5A%3D%3D&linktype=EMAIL_UPDATE_HOME_PROFILE&event-type=MONTHLY_SUMMARY&ref=MONTHLY_SUMMARY&delivery-mode=Email&fuel-type=ELECTRIC")
        cy.visit("http://amerenuat.bidgely.com/dashboard?user-hash=1614160982661v1N16RWBNFVVNCSVsvnF0nBx9RfILfhTTjFjDve3y51jn80VUiygSIl8TR5hyOqTtflxHgl-v-YMpJSGTtIoT_BA==")
        cy.get('.app-bar-container', { timeout: 30000 }).should('be.visible')
        cy.wait(1000)
        cy.get('.hamburger-menu button').click()
        cy.wait(1000)
        cy.get('.MuiList-root > [href="/dashboard/gb-download"]').click()
        cy.wait(1000)
        cy.get('.download-page-title .title', {timeout:10000}).should('have.text', 'Download my data')
        cy.get('.download-page-sub-title').should('have.text', 'Select the time period:')
        cy.get('.gb-download-dropdown > .MuiFormControlLabel-root > .MuiTypography-root').should('have.text', 'Export usage for range of bill period')
        cy.get('.MuiFormGroup-root > :nth-child(2) > :nth-child(1) .MuiFormControlLabel-label').should('have.text', 'Export usage for range of days')
        cy.get('.data-format-msg').should('have.text', 'Data will be downloaded in a xml file.')

        cy.get('.MuiSelect-root').click()
        cy.get('#menu- > .MuiPaper-root > .MuiList-root li').eq(4).click()
        cy.get('.download-page-btn.gb-export-btn',{timeout:10000}).click()
        cy.get('.gb-download-msg',{timeout:10000}).should('have.text', 'GreenButton data downloaded successfully.')
    })
    it("Download my data-2", () => {
        cy.contains('Export usage for range of days').click()
        cy.get('[name="From"]').clear().type('06/09/2022')
        cy.get('[name="To"]').clear().type('06/10/2022')
        cy.get('.download-page-btn.gb-export-btn',{timeout:10000}).click()
        cy.get('.gb-download-msg',{timeout:10000}).should('have.text', 'GreenButton data downloaded successfully.')
        cy.wait(500)
        cy.get('.bidgely-icon-calendar').eq(0).should('be.visible')
        cy.get('.bidgely-icon-calendar').eq(1).should('be.visible')
    })

    it("Cancel button", () => {
        cy.get('.download-page-btn').contains('Cancel').click()
        cy.wait(500)
        cy.get('.home-page-main',{timeout:10000}).should('be.visible')
    })
    it.skip("Upload data", () => {
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

    it.skip('downlaod file in mentioned dir', () => {
        // cy.downloadFile('https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg','Downloads','cypress-example.jpg')
        cy.readFile("cypress/downloads/UsageData-01-05-2022.xml").should('contain', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:espi="http://naesb.org/espi"><id>urn:uuid:60141824-a65b-33f6-a798-9a15e5b7894b</id><title>Green Button Download</title><updated>2022-06-22T06:17:29.167Z</updated><entry><id>urn:uuid:cbea1870-dc9f-3350-8a7f-bf53d83eb417</id><link href="http://amerenuatapi.bidgely.com/LocalTimeParameters/3753160466443062448" rel="self" type="espi-entry/LocalTimeParameters"/><link href="http://amerenuatapi.bidgely.com/LocalTimeParameters" rel="up" type="espi-feed/LocalTimeParameters"/><title>Time Configuration for: ROLLA, 65401</title><content><espi:LocalTimeParameters><espi:dstEndRule>B40E2000</espi:dstEndRule><espi:dstOffset>3600</espi:dstOffset><espi:dstStartRule>360E2000</espi:dstStartRule><espi:tzOffset>-21600</espi:tzOffset></espi:LocalTimeParameters></content><published>2022-06-22T06:17:29.186Z</published><updated>2022-06-22T06:17:29.186Z</updated></entry><entry><id>urn:uuid:7c4965bd-05da-39fa-982e-ed19746402f7</id><link href="http://amerenuatapi.bidgely.com/Customer/39977728884556036/UsagePoint/9197038246783565677" rel="self" type="espi-entry/UsagePoint"/><link href="http://amerenuatapi.bidgely.com/Customer/39977728884556036/UsagePoint/9197038246783565677/MeterReading" rel="related" type="espi-feed/MeterReading"/><link href="http://amerenuatapi.bidgely.com/Customer/39977728884556036/UsagePoint" rel="up" type="espi-feed/UsagePoint"/><link href="http://amerenuatapi.bidgely.com/LocalTimeParameters/3753160466443062448" rel="related" type="espi-entry/LocalTimeParameters"/><title>Green Button Data File. Meter: 10057:_767106007_76710600_07671060015459718001_AMR:inactive4</title><content><espi:UsagePoint><espi:ServiceCategory><espi:kind>')
    })

    it.skip('downlaod file in mentioned dir', () => {
        // cy.downloadFile('https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg','Downloads','cypress-example.jpg')
        cy.readFile("cypress/downloads/UsageData-01-05-2022.xml").should('contain', 'Green Button Data File. Meter: 10057:_767106007_76710600_07671060015459718001_AMR')
        cy.readFile("cypress/downloads/UsageData-01-05-2022.xml").should('contain', '<espi:ReadingType><espi:accumulationBehaviour>4</espi:accumulationBehaviour><espi:commodity>7</espi:commodity><espi:dataQualifier>12</espi:dataQualifier><espi:defaultQuality>17</espi:defaultQuality><espi:flowDirection>1</espi:flowDirection><espi:intervalLength>3600</espi:intervalLength><espi:kind>58</espi:kind><espi:phase>769</espi:phase><espi:powerOfTenMultiplier>-3</espi:powerOfTenMultiplier><espi:timeAttribute>0</espi:timeAttribute><espi:uom>119</espi:uom></espi:ReadingType>')
        cy.readFile("cypress/downloads/UsageData-01-05-2022.xml").should('contain', '<espi:IntervalBlock><espi:interval><espi:duration>86400</espi:duration><espi:start>1639461600</espi:start></espi:interval><espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>86400</espi:duration><espi:start>1639461600</espi:start></espi:timePeriod><espi:value>461562</espi:value></espi:IntervalReading></espi:IntervalBlock>')

    })
})