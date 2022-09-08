import Utils from "../../../utils/Utils";
const utils = new Utils();
let customerId = utils.generateRandomInteger(5);
let contractId = utils.generateRandomInteger(10);
let premiseId = utils.generateRandomInteger(9);
let dataStreamId = utils.generateRandomInteger(10);
let accountType = "RES";
let email;
let firstName = "Sophia";
let lastName = "Watson";
let addressLine1 = "221B Baker Street";
let addressLine2 = "";
let addressLine3 = "";
let addressLine4 = "";
let city = "SAINT CHARLES";
let state = "MO";
let zip = "6883";
let regionCode = "";
let mailingAddress1 = "";
let mailingAddress2 = "";
let mailingAddress3 = "";
let mailingAddress4 = "";
let mailingCity = "";
let mailingState = "";
let mailingZip = "";
let phoneNumber = "";
let phoneType = "";
let language = "";
let dataConsentStatus = "";
let completeUnsubscribe = "";
let ratePlanId = "001";
let billingCycleCode = "4";
let dataStreamType = "AMI";
let serviceType = "ELECTRIC";
let serviceAgreementStartDate = "2017-01-01";
let serviceAgreementEndDate = "";
let ratePlanEffectiveDate = "2020-07-06";
let billingCycleEffectiveDate = "2020-07-06";
let solar = "FALSE";
let label = "";
let bucket = "bidgely-ameren-uat/RES/Incoming";
let fileName = "";
let userFileContent = "";
let meterFileContent = "";
let userDataFileName = 'USERENROLL_D_' + utils.getCurrentDateRandomizer() + '_01.csv';
let meterDataFileName = 'METERENROLL_D_' + utils.getCurrentDateRandomizer() + '_01.csv';
let consumptionDataFileName = 'RAW_D_900_S_' + utils.getCurrentDateRandomizer() + '_01.csv';
let invoiceDataFileName = 'BILLING_' + utils.getCurrentDateRandomizer() + '_01.csv';
const userDataFilePath = 'cypress/temp/' + userDataFileName;
const meterDataFilePath = 'cypress/temp/' + meterDataFileName;
const consumptionDataFilePath = 'cypress/dataGenerator/ameren/data/amarenHistoricalConsumptionData.txt';
const invoiceDataFilePath = 'cypress/dataGenerator/ameren/data/amarenHistoricalInvoiceData.txt';
const consumptionDataTempFilePath = 'cypress/temp/amarenHistoricalConsumptionData.txt';
const invoiceDataTempFilePath = 'cypress/temp/amarenHistoricalInvoiceData.txt';

const customerIdReplacement = {
    files: [invoiceDataTempFilePath, consumptionDataTempFilePath],
    from: 'customerId',
    to: customerId
};

const contractIdReplacement = {
    files: [invoiceDataTempFilePath, consumptionDataTempFilePath],
    from: 'contractId',
    to: contractId
};
const premiseIdReplacement = {
    files: [invoiceDataTempFilePath, consumptionDataTempFilePath],
    from: 'premiseId',
    to: premiseId
};
const dataStreamIdReplacement = {
    files: [invoiceDataTempFilePath, consumptionDataTempFilePath],
    from: 'dataStreamId',
    to: dataStreamId
};

let returnData = {
    contract_Id: contractId,
    premise_Id: premiseId
};

class DataGenerator {

    createData() {
        email = `bidgelyqa+ATU_ameren__${contractId}@bidgely.com`;
        userFileContent = `${customerId}|${contractId}|${premiseId}|${accountType}|${email}|${firstName}|${lastName}|${addressLine1}|${addressLine2}|${addressLine3}|${addressLine4}|${city}|${state}|${zip}|${regionCode}|${mailingAddress1}|${mailingAddress2}|${mailingAddress3}|${mailingAddress4}|${mailingCity}|${mailingState}|${mailingZip}|${phoneNumber}|${phoneType}|${language}|${dataConsentStatus}|${completeUnsubscribe}`;
        meterFileContent = `${customerId}|${contractId}|${premiseId}|${dataStreamId}|${serviceType}|${serviceAgreementStartDate}|${serviceAgreementEndDate}|${ratePlanId}|${ratePlanEffectiveDate}|${billingCycleCode}|${billingCycleEffectiveDate}|${solar}|${dataStreamType}|`;
        cy.writeFile(userDataFilePath, userFileContent);
        cy.writeFile(meterDataFilePath, meterFileContent);
        cy.task('readFile', consumptionDataFilePath)
            .then((data) => { cy.writeFile(consumptionDataTempFilePath, Buffer.from(data, "binary")) });
        cy.task('readFile', invoiceDataFilePath)
            .then((data) => { cy.writeFile(invoiceDataTempFilePath, Buffer.from(data, "binary")) });
        cy.task('readFile', userDataFilePath)
            .then((data) => { utils.uploadToS3(data, userDataFileName, bucket) })
            .then(() => cy.wait(10000))
            .then(() => cy.task('readFile', meterDataFilePath))
            .then((data) => { utils.uploadToS3(data, meterDataFileName, bucket) })
            .then(() => cy.wait(10000))
            .then(() => cy.task('replaceString', customerIdReplacement))
            .then(() => cy.task('replaceString', premiseIdReplacement))
            .then(() => cy.task('replaceString', contractIdReplacement))
            .then(() => cy.task('replaceString', dataStreamIdReplacement))
            .then(() => cy.task('readFile', consumptionDataTempFilePath))
            .then((data) => { utils.uploadToS3(data, consumptionDataFileName, bucket) })
            .then(() => cy.wait(30000))
            .then(() => cy.task('readFile', invoiceDataTempFilePath))
            .then((data) => { utils.uploadToS3(data, invoiceDataFileName, bucket) })
        cy.wait(30000)
        return returnData;
    }
}
export default DataGenerator;