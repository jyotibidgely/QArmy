describe("Accessibility Testing", () => {

    before(function () {
        cy.visit("https://ei-uat.bidgely.com/dashboard?user-hash=1637240649329v1GnBStFGiVXiesZCgANGEQL7VXd4Yq14ilF6TuWsETyR6R3xAUCiHR6PYERYyErlyp6WPZPPsOBwhtdwRE1ScbQ==")
        
        // cy.visit('http://amerenuat.bidgely.com/dashboard?user-hash=1614160982661v1UQBwNbcsK8Y19BGzMhDxHr7Tx51cpUlfAKpMOKtEc8sxNCF9dp5jlg6T6BAq_YysxlV6POwOKhYiQ6vtcN5chQ==')
        cy.injectAxe();
    });

    it("Check homepage", () => {
        cy.get('.chart-container.chart-filter', {timeout:30000}).should('be.visible')
        cy.wait(5000)
        // first a11y test
        cy.customCheckAlly();
    })

    it("Check ADA table", () => {
        cy.get('.app-bar-container .bidgely-icon-energy-insight', { timeout: 10000 }).click()

        cy.get('body').tab().tab().tab().tab({ shift: true })
        // cy.get('[href="/dashboard/home"]').tab({ shift: true })

        cy.get('.accessibility-cta', { timeout: 10000 }).should('be.visible')
        cy.get('.accessibility-cta', { timeout: 10000 }).click()
        cy.get('.consumption-chart-table', {timeout:20000}).should('be.visible')
        cy.wait(2000)
        cy.customCheckAlly();

        // first a11y test
        // cy.checkA11y('.chart-modal-wrapper');
    })

    it("Check Energy Insights", () => {
        cy.get('.bidgely-icon-cancel-circle').click()
        cy.wait(2000)
        cy.get('.app-bar-container .bidgely-icon-energy-insight', { timeout: 10000 }).click()
        cy.get('.insights-main-content', { timeout: 10000 }).should('be.visible')
        cy.wait(1500)
        cy.get('.loading-screen > img',{timeout:20000}).should('not.exist')
        cy.wait(1000)
        cy.customCheckAlly();

        // first a11y test
        // cy.checkA11y(':nth-child(1) > .recommendations-tips-cont');
    })
    it("Recommedations", function () {
        cy.get('.app-bar-container .bidgely-icon-recommendation', { timeout: 10000 }).click()
        cy.get('.recommendations-top-tips', {timeout:20000}).should('be.visible')
        cy.wait(4000)
        cy.customCheckAlly();
  });
})