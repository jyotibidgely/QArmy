// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';
require('cypress-downloadfile/lib/downloadFileCommand')

Cypress.Commands.add("customCheckAlly", () => {
  const severityIndicatorIcons = {
    minor: "⚪",
    moderate: "🌕",
    serious: "⭕",
    critical: "⛔",
  };

  function callback(violations) {
    violations.forEach((violation) => {
      const nodes = Cypress.$(
        violation.nodes.map((node) => node.target).join(",")
      );

      Cypress.log({
        name: `${severityIndicatorIcons[violation.impact]} AllY`,
        consoleProps: () => violation,
        $el: nodes,
        message: `[${violation.help}](${violation.helpUrl})`,
      });

      violation.nodes.forEach(({ target }) => {
        Cypress.log({
          name: "ℹ▶",
          consoleProps: () => violation,
          $el: Cypress.$(target.join(",")),
          message: target,
        });
      });
    });
  }

  cy.checkA11y(null, null, callback);
});

Cypress.Commands.add("customCheckAlly", () => {
  const severityIndicatorIcons = {
    minor: "⚪",
    moderate: "🌕",
    serious: "⭕",
    critical: "⛔",
  };

  function callback(violations) {
    violations.forEach((violation) => {
      const nodes = Cypress.$(
        violation.nodes.map((node) => node.target).join(",")
      );

      Cypress.log({
        name: `${severityIndicatorIcons[violation.impact]} AllY`,
        consoleProps: () => violation,
        $el: nodes,
        message: `[${violation.help}](${violation.helpUrl})`,
      });

      violation.nodes.forEach(({ target }) => {
        Cypress.log({
          name: "ℹ▶",
          consoleProps: () => violation,
          $el: Cypress.$(target.join(",")),
          message: target,
        });
      });
    });
  }

  cy.checkA11y(null, { includedImpacts: ['critical', 'serious'] }, callback);
});

Cypress.Commands.add("customCheckAllyCritical", (excludeItems) => {
  cy.log(excludeItems)
  const severityIndicatorIcons = {
    minor: "⚪",
    moderate: "🌕",
    serious: "⭕",
    critical: "⛔",
  };

  function callback(violations) {
    violations.forEach((violation) => {
      const nodes = Cypress.$(
        violation.nodes.map((node) => node.target).join(",")
      );

      Cypress.log({
        name: `${severityIndicatorIcons[violation.impact]} AllY`,
        consoleProps: () => violation,
        $el: nodes,
        message: `[${violation.help}](${violation.helpUrl})`,
      });

      violation.nodes.forEach(({ target }) => {
        Cypress.log({
          name: "ℹ▶",
          consoleProps: () => violation,
          $el: Cypress.$(target.join(",")),
          message: target,
        });
      });
    });
  }

  cy.checkA11y({ exclude: excludeItems }, { includedImpacts: ['critical', 'serious'] }, callback);
});

Cypress.Commands.add('getAccessToken', () => {
  let tokenUrl = Cypress.env('baseURL') + '/oauth/token?grant_type=client_credentials&scope=all'
  var oauthString = Cypress.env('clientId') + ':' + Cypress.env('clientSecret')
  // Encode the String
  var encodedStringBtoA = btoa(oauthString);
  cy.log(encodedStringBtoA)
  return cy.request({
    method: 'GET',
    url: tokenUrl,
    headers: { 'Authorization': 'Basic ' + encodedStringBtoA }
  })
    .then(function (Response) {
      expect(Response.status).to.eq(200)
      let respbody = Response.body
      expect(respbody).to.have.property('access_token')
      return respbody.access_token
    })
})

Cypress.Commands.add('deleteDownloadsFolder', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  cy.task('deleteFolder', downloadsFolder)
})