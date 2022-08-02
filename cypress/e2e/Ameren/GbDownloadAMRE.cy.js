import GBDownload from "../../pageObjects/GBDownload"
import genericPage from "../../pageObjects/genericPage"

describe("GB download", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    var billingStartTs
    var billingEndTs
    var strStartDate
    var strEndDate
    var strNewStartDate
    var newEpochStartTs
    var strNewEndDate
    var newEpochEndTs
    var arrValues = []
    var strObj = ''
    const uuid = 'ac7951ce-0474-4946-be0c-0539d1d767bc'
    var bearerToken
    var userHash
    var baseUrl = Cypress.env('baseURL')

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.request({
                method: 'GET',
                url: baseUrl+'/v2.0/user-auth/cipher?user-id='+uuid+'&pilot-id='+pilotData.pilotId,
                headers: { 'Authorization': 'Bearer '+bearerToken }, timeout: 30000
            })
                .then((Response) => {
                    expect(Response.status).to.eq(200)
                    let res = Response.body
                    cy.log(res.payload)
                    userHash = res.payload
                    cy.visit(pilotData.url+"dashboard?user-hash="+res.payload)
                })
        })
    })

    it("Invoice data API response", () => {
        cy.log(bearerToken)
        cy.request({
            method: 'GET',
            url: baseUrl+'/billingdata/users/'+uuid+'/homes/1/utilitydata?t0=1&t1=1906986799&measurementType=ELECTRIC',
            headers: { 'Authorization': 'Bearer '+bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                cy.log(res)
                var objLength = Object.keys(res).length;
                var firstKey = Object.keys(res)[objLength-3];
                let objData = res[firstKey]
                cy.log(objData)
                billingEndTs = objData['billingEndTs']
                billingStartTs = objData['billingStartTs']
                cy.log(billingStartTs)
                cy.log(billingEndTs)
                var startTs = new Date(billingStartTs*1000);
                var endTs = new Date(billingEndTs*1000);
                endTs.setDate(endTs.getDate() - 1)
                cy.log(startTs.toLocaleString())
                cy.log(endTs.toDateString())
                strStartDate = objGenericPage.changDateFormat(startTs.toDateString())
                strEndDate = objGenericPage.changDateFormat(endTs.toDateString())
                cy.log('Start date - '+strStartDate)
                cy.wrap(strStartDate).as('strStartDate');

                var newStartTs = new Date(billingEndTs*1000);
                newStartTs.setDate(newStartTs.getDate() - 10)
                strNewStartDate = objGenericPage.changDateFormat(newStartTs.toDateString())
                newEpochStartTs = newStartTs.getTime()/1000

                var newEndTs = new Date(billingEndTs*1000);
                newEndTs.setDate(newEndTs.getDate() -1)
                strNewEndDate = objGenericPage.changDateFormat(newEndTs.toDateString())
                newEpochEndTs = newEndTs.getTime()/1000
            })
    })

    it("Navigate to Download my data", () => {
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
        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
    })
    it("Export data - Days", () => {
        cy.log('Start date - '+strStartDate)

        cy.contains('Export usage for range of days').click()
        objGbDownload.enterFromDate('16/09/20')
        objGbDownload.checkErrorMsg('Invalid Date Format')
        objGbDownload.enterFromDate('03/02/2000')
        objGbDownload.checkErrorMsg('Date should not be before minimal date')
        objGbDownload.enterFromDate(strStartDate)
        objGbDownload.enterToDate('56/09/2022')
        objGbDownload.checkErrorMsg('Invalid Date Format')
        objGbDownload.enterToDate('08/05/2050')
        objGbDownload.checkErrorMsg('Date should not be after maximal date')
        objGbDownload.enterToDate(strEndDate)
        objGbDownload.clickExport()
        objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
        cy.wait(500)
        cy.get(objGbDownload.calendarIcon).eq(0).should('be.visible')
        cy.get(objGbDownload.calendarIcon).eq(1).should('be.visible')
    })

    it("Check Disabled fields", () => {
        cy.contains('Export usage for range of bill period').click()
        cy.wait(500)
        cy.get(objGbDownload.fromDate).should('be.disabled')
        cy.get(objGbDownload.toDate).should('be.disabled')
        cy.get(objGbDownload.calendarIcon).parent().parent().should('be.disabled')
        cy.contains('Export usage for range of days').click()
        cy.wait(500)
        cy.get(objGbDownload.dropdownEle).should('have.attr', 'aria-disabled', 'true')
    })

    it("Cancel button", () => {
        objGbDownload.clickCancelBtn()
        cy.wait(500)
        cy.get('.home-page-main', { timeout: 10000 }).should('be.visible')
    })

    it('Fetch values from RAW data', () => {
        cy.request({
            method: 'GET',
            url: baseUrl+'/streams/users/'+uuid+'/homes/1/gws/3/meters/1/gb.json?t0='+billingStartTs+'&t1='+newEpochEndTs,
            headers: { 'Authorization': 'Bearer '+bearerToken }, timeout: 30000
        })
            .then((Response) => {
                expect(Response.status).to.eq(200)
                let res = Response.body
                cy.log(res)
                var firstKey = Object.keys(res)[0];
                let objData = res[firstKey]
                cy.log(objData)
                // let billingEndTs = objData['billingEndTs']
                for (let index = 0; index < res.length - 1; index++) {
                    const element = res[index];
                    console.log(element)
                    const time = element['time']
                    var value = element['value']
                    const duration = element['duration']
                    value = Math.round(value)
                    cy.log(value)
                    strObj = '<espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>'+duration+'</espi:duration><espi:start>'+time+'</espi:start></espi:timePeriod><espi:value>'+value+'</espi:value></espi:IntervalReading>'
                    arrValues.push(strObj)
                    // console.log(strObj)

                }
            })
    })

    it('Read download file', () => {
        cy.task('downloads', 'cypress/downloads').then(after => {
            console.log(after)
            console.log(strObj)
            cy.readFile("cypress/downloads/" + after).then(fileToRead => {
                // cy.log(fileToRead)
            // cy.readFile("cypress/downloads/" + after).should('contain', 'Green Button Data File. Meter: 10057:_767106007_76710600_07671060015459718001_AMR')
            // cy.readFile("cypress/downloads/" + after).should('contain', '<espi:ReadingType><espi:accumulationBehaviour>4</espi:accumulationBehaviour><espi:commodity>7</espi:commodity><espi:dataQualifier>12</espi:dataQualifier><espi:defaultQuality>17</espi:defaultQuality><espi:flowDirection>1</espi:flowDirection><espi:intervalLength>3600</espi:intervalLength><espi:kind>58</espi:kind><espi:phase>769</espi:phase><espi:powerOfTenMultiplier>-3</espi:powerOfTenMultiplier><espi:timeAttribute>0</espi:timeAttribute><espi:uom>119</espi:uom></espi:ReadingType>')
           for (let index = 0; index < arrValues.length; index++) {
               const element = arrValues[index];
               console.log(element)
               cy.wrap(fileToRead).should('contain', element)
           }
        })
        //     // cy.readFile("cypress/downloads/"+after).should('contain', '<espi:IntervalBlock><espi:interval><espi:duration>86400</espi:duration><espi:start>1654750800</espi:start></espi:interval><espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>86400</espi:duration><espi:start>1654750800</espi:start></espi:timePeriod><espi:value>111300</espi:value></espi:IntervalReading></espi:IntervalBlock></content><published>2022-07-26T13:24:52.275Z</published><updated>2022-07-26T13:24:52.275Z</updated></entry><entry><id>urn:uuid:012bc7b5-2bde-3a8e-9874-31f27f3bf0e0</id><link href="http://amerenuatapi.bidgely.com/Customer/39977728884556036/UsagePoint/9056348086580949057/MeterReading/5429490602267981274/IntervalBlock/5534999940292988461" rel="self" type="espi-entry/IntervalBlock"/><link href="http://amerenuatapi.bidgely.com/Customer/39977728884556036/UsagePoint/9056348086580949057/MeterReading/5429490602267981274/IntervalBlock" rel="up" type="espi-feed/IntervalBlock"/><title>IntervalBlock ID: 3582119876618863370; Start: 2022-06-10T05:00-05:00[CST6CDT]</title><content><espi:IntervalBlock><espi:interval><espi:duration>86400</espi:duration><espi:start>1654837200</espi:start></espi:interval><espi:IntervalReading><espi:ReadingQuality><espi:quality>17</espi:quality></espi:ReadingQuality><espi:timePeriod><espi:duration>86400</espi:duration><espi:start>1654837200</espi:start></espi:timePeriod><espi:value>111300</espi:value></espi:IntervalReading></espi:IntervalBlock>')
        //     //   expect(after.length).to.be.eq(before.length +1)  
        })
    })

    it.skip("Upload data - DMD Validator", () => {
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
})