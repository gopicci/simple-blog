describe('Navigation', function () {
  it('Can navigate to register from home', function () {
    cy.visit('/');
    cy.get('a').contains('Register').click();
    cy.location('pathname').should('eq', '/register');
  });
});