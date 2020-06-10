describe("Navigation", function () {
  it("Can navigate to register from home", function () {
    cy.visit("/");
    cy.get("a").contains("Register").click();
    cy.location("pathname").should("eq", "/register");
  });

  it("Cannot visit create page if not logged in.", function () {
    cy.visit("/create");
    cy.location("pathname").should("eq", "/");
  });
});
