import GBDownload from "../../../pageObjects/GBDownload"
import genericPage from "../../../pageObjects/genericPage"
import ApiResponse from "../../../pageObjects/ApiResponse"

describe("GB download - Multimeter Tests", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const objApiResponse = new ApiResponse()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    let objLength
    var strMinStartDate
    var strMinEndDate
    var measurementType = 'ELECTRIC'
    const uuidMultimeterAMRE = '84767bdf-4ca7-4765-ba5e-2e7146ce118e'
    const uuidMultimeterAMIE = '05573e7a-c88b-4cf0-95c3-f9b3012d50b0'
    const uuidMultimeterAMRG = '1d104bbe-b157-44e5-9b2d-3189434d41ef'
    const uuidMultimeterAMRS = 'c195dfb9-4412-419d-ad7e-8098060d831b'
    const uuidMultimeterAMIS = '37020e8b-1ded-4030-999c-50a17054ade4'
    const uuidRaw10Days = '55c050bf-890b-4b9f-98eb-5d85b36ec8cf'
    const uuidRaw10Days1BC = 'a38887a8-43fd-4911-af0e-3bb756d36f95'
    var bearerToken

    before(function () {
        cy.getAccessToken().then((token) => {
            bearerToken = token
            cy.log(bearerToken)
        })
    })

    beforeEach(() => {
        cy.log('beforeEach')
        cy.deleteDownloadsFolder()
    })

    it("Navigate to Download my data & Export data - Multimeter AMR Electric", () => {
        generateUrl(uuidMultimeterAMRE)
    })

    it("Navigate to Download my data & Export data - Multimeter AMI Electric", () => {
        generateUrl(uuidMultimeterAMIE)
    })

    it("Navigate to Download my data & Export data - Multimeter AMR Solar", () => {
        generateUrl(uuidMultimeterAMRS)
    })

    it("Navigate to Download my data & Export data - Multimeter AMI Solar", () => {
        generateUrl(uuidMultimeterAMIS)
    })

    it("Navigate to Download my data & Export data - 10 days Raw data", () => {
        generateUrl(uuidRaw10Days)
    })

    it("Navigate to Download my data & Export data - 10 days Raw data 1 BillCycle", () => {
        generateUrl(uuidRaw10Days1BC)
    })

    it("Navigate to Download my data & Export data - Multimeter AMR Gas", () => {
        measurementType = 'GAS'
        generateUrl(uuidMultimeterAMRG)
    })

    function generateUrl(uuid) {
        cy.log('UUID - ' + uuid)
        objGenericPage.userHashApiResponse(uuid, pilotData.pilotId).then((res) => {
            cy.log(res.payload)
            cy.visit(pilotData.url + "dashboard?user-hash=" + res.payload)
            invoiceResponse(uuid)
        })
    }

    function invoiceResponse(uuid) {
        objApiResponse.invoiceDataResponse(uuid, measurementType, bearerToken)
            .then((res) => {
                cy.log(res)

                let objFirst = Object.keys(res)[0]
                let firstObjData = res[objFirst]
                let firstBillingStartTs = firstObjData['billingStartTs']
                let firstBillingEndTs = firstObjData['billingEndTs']
                let firstStartTs = new Date(firstBillingStartTs * 1000);
                let firstEndTs = new Date(firstBillingEndTs * 1000);
                firstEndTs.setDate(firstEndTs.getDate() - 1)
                strMinStartDate = objGenericPage.changDateFormat(firstStartTs.toDateString())
                strMinEndDate = objGenericPage.changDateFormat(firstEndTs.toDateString())

                objGenericPage.checkHeader()
                cy.wait(1000)
                objGenericPage.clickDownloadMyData()
                cy.wait(1000)
                var billPeriodStartDateTwo = objGenericPage.changDateFormatString(strMinStartDate)
                var billPeriodEndDateTwo = objGenericPage.changDateFormatString(strMinEndDate)
                let strBillPeriodDate = billPeriodStartDateTwo + ' - ' + billPeriodEndDateTwo
                cy.log(strBillPeriodDate)
                objGbDownload.verifyPageTitle();

                cy.contains('Export usage for range of days').click()
                objGbDownload.enterFromDate(strMinStartDate)
                objGbDownload.enterToDate(strMinEndDate)
                objGbDownload.clickExport()
                objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                cy.wait(2000)
                cy.task('downloads', 'cypress/downloads').then(after => {
                    expect(after.length).to.be.eq(1)
                })

            })
    }
})