import GBDownload from "../pageObjects/GBDownload"
import genericPage from "../pageObjects/genericPage"

describe("GB download", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()

    it("Navigate to Download my data", () => {
        // cy.visit("https://nsp-uat.bidgely.com/dashboard/insights/monthly-summary?user-hash=1633088930681v1ZHPIZWp1inkItirOPVBMHdtVXNtTUqvfYzmqVsmSfwyVDY-UEZx0FBrdpVRKH7Yv9Nof-sRKypDk2kXkrqVo5A%3D%3D&linktype=EMAIL_UPDATE_HOME_PROFILE&event-type=MONTHLY_SUMMARY&ref=MONTHLY_SUMMARY&delivery-mode=Email&fuel-type=ELECTRIC")
        cy.visit("http://amerenuat.bidgely.com/dashboard?user-hash=1614160982661v1N16RWBNFVVNCSVsvnF0nBx9RfILfhTTjFjDve3y51jn80VUiygSIl8TR5hyOqTtflxHgl-v-YMpJSGTtIoT_BA==")
        objGenericPage.checkHeader()
        cy.wait(1000)
        objGenericPage.clickMenuBtn()
        cy.wait(1000)
        cy.get('.MuiList-root > [href="/dashboard/gb-download"]').click()
        cy.wait(1000)
    })
    it("Export data - Bill period", () => {
        objGbDownload.verifyPageTitle();
        objGbDownload.verifySubtitle()
        objGbDownload.verifyExportBillLabel()
        objGbDownload.verifyExportDaysLabel()
        objGbDownload.verifyDataMsg()
        objGbDownload.selectDropdownElement()

        cy.get(objGbDownload.exportBtn)
            .should('have.css', 'background-color')
            .and('eq', 'rgb(27, 108, 181)')

        cy.get(objGbDownload.exportBtn)
            .should('have.css', 'cursor')
            .and('eq', 'pointer')

        cy.get('.download-page-btn').contains('Cancel')
            .should('have.css', 'background-color')
            .and('eq', 'rgba(0, 0, 0, 0)')

        cy.get('.download-page-btn').contains('Cancel')
            .should('have.css', 'cursor')
            .and('eq', 'pointer')

        objGbDownload.clickExport()
        objGbDownload.checkSuccessMsg()
    })
    it("Export data - Days", () => {
        cy.contains('Export usage for range of days').click()
        cy.get('[name="From"]').clear().type('06/09/2022')
        cy.get('[name="To"]').clear().type('06/10/2022')
        cy.get('.download-page-btn.gb-export-btn', { timeout: 10000 }).click()
        cy.get('.gb-download-msg', { timeout: 10000 }).should('have.text', 'GreenButton data downloaded successfully.')
        cy.wait(500)
        cy.get('.bidgely-icon-calendar').eq(0).should('be.visible')
        cy.get('.bidgely-icon-calendar').eq(1).should('be.visible')
    })

    it("Check Disabled fields", () => {
        cy.contains('Export usage for range of bill period').click()
        cy.wait(500)
        cy.get(objGbDownload.fromDate).should('be.disabled')
        cy.get(objGbDownload.toDate).should('be.disabled')
        cy.get('.bidgely-icon-calendar').parent().parent().should('be.disabled')
        cy.contains('Export usage for range of days').click()
        cy.wait(500)
        cy.get(objGbDownload.dropdownEle).should('have.attr', 'aria-disabled', 'true')
    })

    it("Cancel button", () => {
        objGbDownload.clickCancelBtn()
        cy.wait(500)
        cy.get('.home-page-main', { timeout: 10000 }).should('be.visible')
    })
    it("Upload data - DMD Validator", () => {
        cy.visit("https://dmdvalidator.greenbuttonalliance.org/")
        cy.get('#FBSelection', { timeout: 10000 }).should('be.visible')
        cy.get('select').select('Energy Usage file: Electricity Interval Metering')
        cy.wait(200)
        cy.get('#FB_15').uncheck({ force: true })
        cy.wait(500)
        cy.task('downloads', 'cypress/downloads').then(p => {
            //file to be uploaded path in project folder
            const fileToUpload = "../downloads/" + p
            cy.log(fileToUpload)
            //upload file with attachFile
            cy.get('#dropZone')
                .attachFile(fileToUpload, { subjectType: 'drag-n-drop' });
            cy.get(':nth-child(6) > thead > tr > td', { timeout: 15000 }).should('have.text', ' ...all tests were successful.')
        })
    })

    it('downlaod file in mentioned dir', () => {
        cy.task('downloads', 'cypress/downloads').then(after => {
            cy.log(after)
            cy.readFile("cypress/downloads/" + after).should('contain', 'Green Button Data File. Meter: 10057:_767106007_76710600_07671060015459718001_AMR')
            cy.readFile("cypress/downloads/" + after).should('contain', '<espi:ReadingType><espi:accumulationBehaviour>4</espi:accumulationBehaviour><espi:commodity>7</espi:commodity><espi:dataQualifier>12</espi:dataQualifier><espi:defaultQuality>17</espi:defaultQuality><espi:flowDirection>1</espi:flowDirection><espi:intervalLength>3600</espi:intervalLength><espi:kind>58</espi:kind><espi:phase>769</espi:phase><espi:powerOfTenMultiplier>-3</espi:powerOfTenMultiplier><espi:timeAttribute>0</espi:timeAttribute><espi:uom>119</espi:uom></espi:ReadingType>')
            // cy.readFile("cypress/downloads/"+after).should('contain', '<espi:IntervalBlock><espi:interval><espi:duration>86400</espi:duration><espi:start>1654750800</espi:start></espi:interval><espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>86400</espi:duration><espi:start>1654750800</espi:start></espi:timePeriod><espi:value>111300</espi:value></espi:IntervalReading></espi:IntervalBlock></content><published>2022-07-26T13:24:52.275Z</published><updated>2022-07-26T13:24:52.275Z</updated></entry><entry><id>urn:uuid:012bc7b5-2bde-3a8e-9874-31f27f3bf0e0</id><link href="http://amerenuatapi.bidgely.com/Customer/39977728884556036/UsagePoint/9056348086580949057/MeterReading/5429490602267981274/IntervalBlock/5534999940292988461" rel="self" type="espi-entry/IntervalBlock"/><link href="http://amerenuatapi.bidgely.com/Customer/39977728884556036/UsagePoint/9056348086580949057/MeterReading/5429490602267981274/IntervalBlock" rel="up" type="espi-feed/IntervalBlock"/><title>IntervalBlock ID: 3582119876618863370; Start: 2022-06-10T05:00-05:00[CST6CDT]</title><content><espi:IntervalBlock><espi:interval><espi:duration>86400</espi:duration><espi:start>1654837200</espi:start></espi:interval><espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>86400</espi:duration><espi:start>1654837200</espi:start></espi:timePeriod><espi:value>111300</espi:value></espi:IntervalReading></espi:IntervalBlock>')
            //   expect(after.length).to.be.eq(before.length +1)  
        })
    })
})