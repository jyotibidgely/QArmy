const AWS = require('aws-sdk');
const fs = require('fs');
const replace = require('replace-in-file');
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

    uploadToS3(data, name, bucket, credentials) {
        if (data == null || name == null || bucket == null) {
            throw new Error('unable to upload data to S3');
        }
        const s3bucket = new AWS.S3();
        debugger;
        s3bucket.config.update({
            region: 'us-west-2',
            apiVersion: 'latest',
            credentials: {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey
            },
        });

        var metadata = { utility_file_name: name };
        const params = {
            Bucket: bucket,
            Key: name,
            Body: Buffer.from(data, "binary"),
            metadata: metadata
        };

        s3bucket.upload(params, (err) => {
            if (err) { throw err; }
            /* eslint-disable no-console */
            console.log('Success!');
            /* eslint-enable no-console */
        })
    }
}

export default Utils;
export const utils = new Utils();