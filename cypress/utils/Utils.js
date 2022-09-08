const AWS = require('aws-sdk');
const fs = require('fs');
const replace = require('replace-in-file');
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let AWS_ACCESS_KEY_ID = Cypress.env('CYPRESS_AWS_ACCESS_KEY_ID');
let AWS_SECRET_ACCESS_KEY = Cypress.env('CYPRESS_AWS_SECRET_ACCESS_KEY');
let AWS_DEFAULT_REGION = Cypress.env('CYPRESS_AWS_DEFAULT_REGION');

class Utils {

    generateUUID() {
        var dt = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    generateRandomString(length) {
        let result = ' ';
        const charactersLength = this.characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    generateRandomInteger(length) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    }

    getCurrentDateRandomizer() {
        let d = new Date();
        return "" + d.getFullYear() + d.getMonth() + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
    }

    uploadToS3(data, name, bucket) {
        if (data == null || name == null || bucket == null) {
            throw new Error('unable to upload data to S3');
        }
        const s3bucket = new AWS.S3();
        s3bucket.config.update({
            region: AWS_DEFAULT_REGION,
            apiVersion: 'latest',
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            },
        });
        const params = {
            Bucket: bucket,
            Key: name,
            Body: Buffer.from(data, "binary")
        };

        s3bucket.upload(params, (err, name) => {
            if (err) { throw err; }
            /* eslint-disable no-console */
            console.log('Success!');
            /* eslint-enable no-console */
        });
    }
}

export default Utils;
export const utils = new Utils();