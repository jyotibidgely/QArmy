import Utils from "../../../utils/Utils";
const utils = new Utils();
let customerId = utils.generateRandomInteger(11);
let contractId = utils.generateRandomInteger(13);
let premiseId = utils.generateRandomInteger(12);
let dataStreamId = utils.generateRandomInteger(16);
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
let zip = "63385";
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
let ratePlanId = "052";
let billingCycleCode = "14";
let dataStreamType;
let serviceType = "ELECTRIC";
let serviceAgreementStartDate = "2017-01-01";
let serviceAgreementEndDate = "";
let ratePlanEffectiveDate = "2016-09-02";
let billingCycleEffectiveDate = "2016-09-02";
let solar = "False";
let label = "";
let fileName = "";
let profile = 'default';
let awsKeys_accessKeyId;
let awsKeys_secretAccessKey;
let userFileContent = "";
let meterFileContent = "";
const userDataTempFilePath = 'cypress/temp/amerenUserEnroll.csv';
const meterDataTempFilePath = 'cypress/temp/amerenMeterEnroll.csv';
const consumptionDataTempFilePath = 'cypress/temp/amerenHistoricalConsumptionData.csv';
const invoiceDataTempFilePath = 'cypress/temp/amerenHistoricalInvoiceData.csv';

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

const credentials = {
    accessKeyId: awsKeys_accessKeyId,
    secretAccessKey: awsKeys_secretAccessKey
}

let returnData = {
    contract_Id: contractId,
    premise_Id: premiseId
};

class DataGenerator {

    createData(dataGenerationInput) {
        email = `bidgelyqa+ATU_ameren__${contractId}@bidgely.com`;
        dataStreamType = dataGenerationInput.dataStreamType
        serviceType = dataGenerationInput.measurementType

        userFileContent = `${customerId}|${contractId}|${premiseId}|${accountType}|${email}|${firstName}|${lastName}|${addressLine1}|${addressLine2}|${addressLine3}|${addressLine4}|${city}|${state}|${zip}|${regionCode}|${mailingAddress1}|${mailingAddress2}|${mailingAddress3}|${mailingAddress4}|${mailingCity}|${mailingState}|${mailingZip}|${phoneNumber}|${phoneType}|${language}|${dataConsentStatus}|${completeUnsubscribe}`;
        meterFileContent = `${customerId}|${contractId}|${premiseId}|${dataStreamId}|${serviceType}|${serviceAgreementStartDate}|${serviceAgreementEndDate}|${dataGenerationInput.ratePlanId}|${ratePlanEffectiveDate}|${dataGenerationInput.billingCycleCode}|${billingCycleEffectiveDate}|${solar}|${dataStreamType}|`;
        cy.writeFile(userDataTempFilePath, userFileContent);
        cy.writeFile(meterDataTempFilePath, meterFileContent);
        cy.task('readCredentials', profile).then((awsKeys) => {
            credentials.accessKeyId = awsKeys.accessKeyId,
                credentials.secretAccessKey = awsKeys.secretAccessKey
        });
        cy.task('readFile', dataGenerationInput.consumptionDataFilePath)
            .then((data) => { cy.writeFile(consumptionDataTempFilePath, Buffer.from(data, "binary")) });
        cy.task('readFile', dataGenerationInput.invoiceDataFilePath)
            .then((data) => { cy.writeFile(invoiceDataTempFilePath, Buffer.from(data, "binary")) });
        cy.task('readFile', userDataTempFilePath)
            .then((data) => { utils.uploadToS3(data, dataGenerationInput.userFileName, dataGenerationInput.pilotData.bucket, credentials) })
            .then(() => cy.wait(30000))
            .then(() => cy.task('readFile', meterDataTempFilePath))
            .then((data) => { utils.uploadToS3(data, dataGenerationInput.meterFileName, dataGenerationInput.pilotData.bucket, credentials) })
            .then(() => cy.wait(60000))
            .then(() => cy.task('replaceString', customerIdReplacement))
            .then(() => cy.task('replaceString', premiseIdReplacement))
            .then(() => cy.task('replaceString', contractIdReplacement))
            .then(() => cy.task('replaceString', dataStreamIdReplacement))
            .then(() => cy.task('readFile', consumptionDataTempFilePath))
            .then((data) => { utils.uploadToS3(data, dataGenerationInput.rawFileName, dataGenerationInput.pilotData.bucket, credentials) })
            .then(() => cy.wait(60000))
            .then(() => cy.task('readFile', invoiceDataTempFilePath))
            .then((data) => { utils.uploadToS3(data, dataGenerationInput.invoiceFileName, dataGenerationInput.pilotData.bucket, credentials) })
        cy.wait(60000)
        return returnData;
    }
}
export default DataGenerator;