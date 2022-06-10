describe("Homepage", () => {
    const texts = [];

    it("Check homepage", () => {
        cy.visit("https://scgnonprodqa.bidgely.com/dashboard?user-hash=1575288968349v1EGIHaCOJLEwnojIuPZF6JJlo2k4F2I9X6DzQ6ITXKqzy-vp7LoaRJQeVYjLhPq4CHNVK377hZ5NyuttGuEsGQg==")
        // cy.title( { timeout: 10000 }).should('eq', 'scgnonprodqa.bidgely.com/')
        // cy.wait(10000)
        cy.get('.survey-container', { timeout: 10000 }).should('be.visible')
        cy.contains('Preferences').click()
        cy.wait(2000)
        cy.get('.loading-screen > img', { timeout: 20000 }).should('not.exist')
        cy.get('.column-right > .MuiPaper-root').should('be.visible')
        cy.contains('Frequently Asked Questions').click()
        cy.wait(2000)
        cy.get('.loading-screen > img', { timeout: 20000 }).should('not.exist')
        cy.get('.disagg-header-container').should('be.visible')
        cy.get('.utility-footer').scrollIntoView()
        cy.get('[href="/dashboard/settingsPreferences?tab-type=alertType"]').click()
        cy.wait(2000)
        cy.get('.loading-screen > img', { timeout: 20000 }).should('not.exist')
        cy.contains('How You Get Notifications').should('be.visible')
    })
})