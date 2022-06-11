describe("Homepage", () => {

    before(function () {
        cy.visit("https://ei-uat.bidgely.com/dashboard?user-hash=1637240649329v1GnBStFGiVXiesZCgANGEQL7VXd4Yq14ilF6TuWsETyR6R3xAUCiHR6PYERYyErlyp6WPZPPsOBwhtdwRE1ScbQ==")
        cy.injectAxe();
    });

    it("Check homepage", () => {
        cy.visit("https://nsp-nonprodqa.bidgely.com/dashboard?user-hash=1628514825184v1HiaTjgQU1MW4SKNeRD91IWF7l1vHXbwgroXtFEhDsNrWhRZAud6ZpQ1qhV91wqfFqY6F72nPe6MIHsbbjCDKjw==")
        // cy.title( { timeout: 10000 }).should('eq', 'scgnonprodqa.bidgely.com/')
        // cy.wait(10000)
        cy.injectAxe();

        cy.get('.app-bar-container .bidgely-icon-energy-insight', { timeout: 10000 }).click()
        cy.get('.accessibility-cta', { timeout: 10000 }).click()
        cy.wait(5000)

        // first a11y test
        cy.checkA11y();
    })

    it("Check homepage", () => {
        cy.visit("https://ei-uat.bidgely.com/dashboard?user-hash=1637240649329v1GnBStFGiVXiesZCgANGEQL7VXd4Yq14ilF6TuWsETyR6R3xAUCiHR6PYERYyErlyp6WPZPPsOBwhtdwRE1ScbQ==")
        
        // cy.wait(10000)
        cy.injectAxe();

        cy.get('.chart-container', { timeout: 30000 }).should('be.visible')
        cy.get('.app-bar-container .bidgely-icon-energy-insight', { timeout: 10000 }).click()
        cy.get('.accessibility-cta', { timeout: 10000 }).should('be.visible')
        cy.get('.accessibility-cta', { timeout: 10000 }).click()
        cy.get('.consumption-chart-table', {timeout:20000}).should('be.visible')
        // cy.wait(5000)

        // first a11y test
        cy.checkA11y('.chart-modal-wrapper');
    })

    it("Check Energy Insights", () => {
        
        // cy.wait(10000)
        cy.injectAxe();

        cy.get('.bidgely-icon-cancel-circle').click()
        cy.wait(2000)
        // cy.get('.app-bar-container .bidgely-icon-energy-insight', { timeout: 10000 }).click()
        // cy.get('.insights-main-content', { timeout: 10000 }).should('be.visible')
        // cy.get('.accessibility-cta', { timeout: 10000 }).click()
        // cy.get('.consumption-chart-table', {timeout:10000}).should('be.visible')
        // cy.wait(5000)

        // first a11y test
        cy.checkA11y('');
    })
    it.only("Accessibility Test Case - Custom Command", function () {
        cy.get('.chart-container.chart-filter', {timeout:20000}).should('be.visible')
        cy.customCheckAlly();
  });
})