const login = () => {
  const { email, password } = Cypress.env("credentials");

  // Capture HTTP requests.
  cy.server();
  cy.route("POST", "**/api/login/**").as("login");

  // Log into the app.
  cy.visit("/");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password, { log: false });
  cy.get("button").contains("Login").click();
  cy.wait("@login");
};

describe("Authentication", function () {
  it("Can register.", function () {
    const { username, email, password } = Cypress.env("credentials");

    cy.server();
    cy.route("POST", "**/api/register/**").as("register");

    cy.visit("/register");
    cy.get("#username").type(username);
    cy.get("#email").type(email);
    cy.get("#password1").type(password, { log: false });
    cy.get("#password2").type(password, { log: false });
    cy.get("button").contains("Register").click();
    cy.wait("@register");
    cy.location("pathname").should("eq", "/registered");
  });

  it("Can log in.", function () {
    login();
    cy.get("button").contains("Login").should("not.exist");
    cy.get("button").contains("Logout").should("exist");
  });

  it("Can log out.", function () {
    login();

    cy.server();
    cy.route("POST", "**/api/logout/**").as("logout");

    cy.get("button").contains("Login").should("not.exist");
    cy.get("button").contains("Logout").should("exist");
    cy.get("button").contains("Logout").click();
    cy.wait("@logout");
    cy.get("button").contains("Login").should("exist");
    cy.get("button").contains("Logout").should("not.exist");
  });

  it("Cannot go to register page once logged in.", function () {
    login();
    cy.visit("/register");
    cy.location("pathname").should("eq", "/");
  });
});
