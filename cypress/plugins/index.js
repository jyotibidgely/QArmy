/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const path = require("path");
const aws = require('aws-sdk');
const fsExtra = require("fs-extra");
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin')
const fs = require('fs');
const { rmdir } = require('fs');
const { replaceInFile } = require('replace-in-file');

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("cypress/config", `${file}.json`);
  console.log('second')
  return fsExtra.readJson(pathToConfigFile);
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
  })

  on('task', { downloadFile })

  on('task', {
    downloads: (downloadspath) => {
      return fs.readdirSync(downloadspath)
    }
  })

  on('task', {
    replaceString: (options) => {
      debugger;
      const regEx = new RegExp(options.from, "g");
      const replaceStringParams = {
        files: options.files,
        from: regEx,
        to: options.to
      };

      return replaceInFile(replaceStringParams);

    }
  })

  on('task', {
    readFile: (filePath) => {
      return (fs.readFileSync(filePath))
    }
  })

  on('task', {
    readAWSCreds: () => {
      debugger;
      var diskProvider = new aws.FileSystemCredentials('~/.aws/credentials');
      var chain = new aws.CredentialProviderChain();
      chain.providers.push(diskProvider);
      chain.resolve();
    }
  })

  on('task', {
    deleteFolder(folderName) {
      debugger;
      if (fs.existsSync(folderName)) {
        fs.rmSync(folderName, { recursive: true, force: true })
      }
      return true;
    },
  })

  const file = config.env.configFile || "uat";
  console.log('first')
  return getConfigurationByFile(file);
}
