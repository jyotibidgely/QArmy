import Utils from "../../../utils/Utils";
const utils = new Utils();
let partnerUserId = utils.generateRandomInteger(11);
let contractAccountId = utils.generateRandomInteger(13);
let contractId = utils.generateRandomInteger(11);
let premiseId = utils.generateRandomInteger(11);
let dataStreamId = utils.generateRandomInteger(9);
let accountType = "RES";
let email;
let firstName = "godspeed";
let lastName = "Bidgely";
let addressLine1 = "13 DOLPHIN DR KINGSTON TAS 7050";
let addressLine2 = "";
let addressLine3 = "";
let addressLine4 = "";
let city = "Grattan";
let state = "ON";
let zip = "7050";
let regionCode = "TAS";
let mailingAddress1 = "13 DOLPHIN DR KINGSTON TAS 7050";
let mailingAddress2 = "";
let mailingAddress3 = "";
let mailingAddress4 = "";
let mailingCity = "KINGSTON";
let mailingState = "Tasmania";
let mailingZip = "7050";
let phoneNumber = "0420506300";
let phoneType = "CELLULAR";
let language = "EN";
let dataConsentStatus = "OBTAINED";
let completeUnsubscribe = "FALSE";
let serviceType = "ELECTRIC";
let serviceAgreementStartDate = "2015-05-27";
let serviceAgreementEndDate = "";
let ratePlanId = "R1_TOU_RPP";
let ratePlanEffectiveDate = "2015-07-28";
let billingCycleCode = "M09";
let billingCycleEffectiveDate = "";
let solar = "FALSE";
let dataStreamType = "AMI";
let label = "";
let bucket = "bidgely-hydroone-nonprodqa";
let userFilePrefix = "USERENROLL_D_";
let userFileSuffix = "_01.txt";
let fileName = "";
let userFileContent = "";
let consumptionDataFileName = 'RAW_D_3600_S_' + utils.getCurrentDateRandomizer() + '.txt';
let invoiceDataFileName = 'INVOICE_' + utils.getCurrentDateRandomizer() + '.txt';
const consumptionDataFilePath = 'cypress/dataGenerator/honi/data/honiHistoricalConsumptionData.txt';
const invoiceDataFilePath = 'cypress/dataGenerator/honi/data/honiHistoricalInvoiceData.txt';
const consumptionDataTempFilePath = 'cypress/temp/honiHistoricalConsumptionData.txt';
const invoiceDataTempFilePath = 'cypress/temp/honiHistoricalInvoiceData.txt';

const invoiceDataDataStreamIdReplacement = {
    files: invoiceDataTempFilePath,
    from: 'dataStreamId',
    to: dataStreamId
};

const invoiceDataPartnerUserIdReplacement = {
    files: invoiceDataTempFilePath,
    from: 'partnerUserId',
    to: partnerUserId
};
const invoiceDataContractAccountIdReplacement = {
    files: invoiceDataTempFilePath,
    from: 'contractAccountId',
    to: contractAccountId
};
const invoiceDataContractIdReplacement = {
    files: invoiceDataTempFilePath,
    from: 'contractId',
    to: contractId
};

class UserCreator {

    createUser() {
        email = `bidgelyqa+HONI_NP_${partnerUserId}@bidgely.com`;

        userFileContent = `${partnerUserId}|${contractAccountId}|${contractId}|${premiseId}|${accountType}|${email}|${firstName}|${lastName}|${addressLine1}|${addressLine2}|${addressLine3}|${addressLine4}|${city}|${state}|${zip}|${regionCode}|${mailingAddress1}|${mailingAddress2}|${mailingAddress3}|${mailingAddress4}|${mailingCity}|${mailingState}|${mailingZip}|${phoneNumber}|${phoneType}|${language}|${dataConsentStatus}|${completeUnsubscribe}|${dataStreamId}|${serviceType}|${serviceAgreementStartDate}|${serviceAgreementEndDate}|${ratePlanId}|${ratePlanEffectiveDate}|${billingCycleCode}|${billingCycleEffectiveDate}|${solar}|${dataStreamType}|${label}`;

        fileName = userFilePrefix + "" + utils.getCurrentDateRandomizer() + userFileSuffix;
        var filePath = 'cypress/temp/' + fileName;

        cy.writeFile(filePath, userFileContent);

        cy.task('readFile', consumptionDataFilePath)
            .then((data) => { cy.writeFile(consumptionDataTempFilePath, Buffer.from(data, "binary")) });

        cy.task('readFile', invoiceDataFilePath)
            .then((data) => { cy.writeFile(invoiceDataTempFilePath, Buffer.from(data, "binary")) });

        return cy.task('readFile', filePath)
            .then((data) => {
                utils.uploadToS3(data, fileName, bucket);
                const consumptionDataReplacement = {
                    files: consumptionDataTempFilePath,
                    from: 'dataStreamId',
                    to: dataStreamId
                }
                return cy.task('replaceString', consumptionDataReplacement);
            })
            .then(() => cy.task('readFile', consumptionDataTempFilePath))
            .then((data) => {
                utils.uploadToS3(data, consumptionDataFileName, bucket)
            })
            .then(() => cy.task('replaceString', invoiceDataPartnerUserIdReplacement))
            .then(() => cy.task('replaceString', invoiceDataContractAccountIdReplacement))
            .then(() => cy.task('replaceString', invoiceDataContractIdReplacement))
            .then(() => cy.task('replaceString', invoiceDataDataStreamIdReplacement))
            .then(() => cy.task('readFile', invoiceDataTempFilePath))
            .then((data) => {
                utils.uploadToS3(data, invoiceDataFileName, bucket)
            })
    }
}
export default UserCreator;