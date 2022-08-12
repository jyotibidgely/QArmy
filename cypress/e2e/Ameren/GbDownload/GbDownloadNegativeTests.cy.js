import GBDownload from "../../../pageObjects/GBDownload"
import genericPage from "../../../pageObjects/genericPage"
import ApiResponse from "../../../pageObjects/ApiResponse"

describe("GB download - Negative Tests", () => {
    const objGenericPage = new genericPage()
    const objGbDownload = new GBDownload()
    const objApiResponse = new ApiResponse()
    const utility = 'ameren'
    const pilotData = Cypress.env(utility)
    const strMeasurementType = 'ELECTRIC'
    let objLength
    var strMinStartDate
    var strMinEndDate
    const uuid1BC = '91b88225-e17a-4778-b0c3-13cd0dd6f99d'
    const uuidNoRaw = '53fe484b-f702-4c73-9779-c04aa9c6d100'
    const uuid1Raw = 'b088ba64-0738-4768-b990-2cee740a36c3'
    const uuidZeroCost = 'f44aaaf5-cb4a-41e0-8104-be520b1ebaec'
    const uuidNegativeValuesRAW = 'b02363df-62d3-4d4a-af2a-9b90f339c276'
    const uuidNegativeValuesInvoice = '95e62c50-3c50-4a72-8fe1-5502367bfacc'
    const uuidZeroConsumption = '5a059e56-f477-4d7f-85de-1a7b06b337e7'
    const uuidOverlappingBcOne = '581da838-8e14-42c9-b18c-17dacaf069a3'
    const uuidOverlappingBcTwo = '6f398be6-de38-4dcc-a27c-04d4635559f8'
    const uuidShorterBc = '6f398be6-de38-4dcc-a27c-04d4635559f8'
    const uuidAmrE = '4b315c75-64f1-4b04-bc92-c64825a9cb0b'
    const uuidAmiE = '56ecde20-b0d3-42e9-9a65-5ea4d6adebb8'
    const uuidNoInvoice = '193155f8-c2af-4bdf-a749-c4dee1254012'
    const uuidAmrAmiHistData = 'efdd88eb-d301-43fa-8649-e1dcf8039ed0'
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

    it("Navigate to Download my data & Export data - 1 BC missing", () => {
        generateUrl(uuid1BC)
    })

    it("Navigate to Download my data & Export data - No Raw", () => {
        generateUrl(uuidNoRaw)
    })

    it("Navigate to Download my data & Export data - One Raw", () => {
        generateUrl(uuid1Raw)
    })

    it("Navigate to Download my data & Export data - Zero cost Raw data", () => {
        generateUrl(uuidZeroCost)
    })

    it("Navigate to Download my data & Export data - Negative consumption", () => {
        generateUrl(uuidNegativeValuesRAW)
    })

    it("Navigate to Download my data & Export data - Negative billing", () => {
        generateUrl(uuidNegativeValuesInvoice)
    })

    it("Navigate to Download my data & Export data - Zero Consumption RAW", () => {
        generateUrl(uuidZeroConsumption)
    })

    it("Navigate to Download my data & Export data - Overlapping BillCycle One", () => {
        generateUrl(uuidOverlappingBcOne)
    })

    it("Navigate to Download my data & Export data - Overlapping BillCycle Two", () => {
        generateUrl(uuidOverlappingBcTwo)
    })

    it("Navigate to Download my data & Export data - Shorter BillCycle", () => {
        generateUrl(uuidShorterBc)
    })

    it("Navigate to Download my data & Export data - AMR E", () => {
        generateUrl(uuidAmrE)
    })

    it("Navigate to Download my data & Export data - AMI E", () => {
        generateUrl(uuidAmiE)
    })

    it("Navigate to Download my data & Export data - AMR-AMI Historical data", () => {
        generateUrl(uuidAmrAmiHistData)
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
        objApiResponse.invoiceDataResponse(uuid, strMeasurementType, bearerToken)
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
                objGbDownload.verifySubtitle()
                objGbDownload.verifyExportBillLabel()
                objGbDownload.verifyExportDaysLabel()
                cy.get(objGbDownload.dropdownEle).click()
                cy.get(objGbDownload.dropdownList).last().should('have.text', strBillPeriodDate).click()
                objGbDownload.clickExport()
                objGbDownload.checkSuccessMsg('GreenButton data downloaded successfully.')
                cy.wait(2000)
                cy.task('downloads', 'cypress/downloads').then(after => {
                    expect(after.length).to.be.eq(1)
                })
            })
    }
})