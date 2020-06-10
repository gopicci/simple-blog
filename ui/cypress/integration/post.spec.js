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

describe("Blogging", function () {
  it("Can create a post.", function () {
    const { title, slug, tag, body } = Cypress.env("post");

    login();

    cy.server();
    cy.route("POST", "**/api/blog/**").as("create");

    cy.visit("/create");
    cy.get("#title").type(title);
    cy.get(".ReactTags__tagInputField").type(tag).type("{enter}");
    cy.get(".ql-editor").click().type(body);
    cy.get("button").contains("Post").click();
    cy.wait("@create");
    cy.location("pathname").should("eq", `/${slug}`);
  });

  it("Cannot create a post with existing title.", function () {
    const { title, tag, body } = Cypress.env("post");

    login();

    cy.server();
    cy.route("POST", "**/api/blog/**").as("create");

    cy.visit("/create");
    cy.get("#title").type(title);
    cy.get(".ReactTags__tagInputField").type(tag).type("{enter}");
    cy.get(".ql-editor").click().type(body);
    cy.get("button").contains("Post").click();
    cy.wait("@create");
    cy.get(".invalid-feedback").should(
      "contain",
      "blog post with this title already exists."
    );
  });

  it("Can visit a post.", function () {
    const title = Cypress.env("post")["title"];
    const slug = Cypress.env("post")["slug"];

    cy.server();
    cy.route("GET", `**/api/blog/${slug}**`).as("visit");

    cy.visit(`/${slug}`);
    cy.wait("@visit");
    cy.get(".postTitle").should("contain", title);
  });

  it("Can edit a post if author.", function () {
    const { title, slug, tag, body } = Cypress.env("post-edit");

    login();

    cy.server();
    cy.route("PUT", `**/api/blog/${slug}**`).as("edit");

    cy.visit(`/${slug}/edit`);
    cy.wait(1000);
    cy.get("#formTitle").clear().type(title);
    cy.get(".ReactTags__tagInputField").type(tag).type("{enter}");
    cy.get(".ql-editor").click().type(body);
    cy.get("button").contains("Edit post").click();
    cy.wait("@edit");
    cy.location("pathname").should("eq", `/${slug}`);
    cy.get(".postTitle").should("contain", title);
  });

  it("Cannot edit post if not author.", function () {
    const { username, email, password } = Cypress.env("credentials2");
    const slug = Cypress.env("post")["slug"];

    cy.server();
    cy.route("POST", "**/api/register/**").as("register");

    cy.visit("/register");
    cy.get("#username").type(username);
    cy.get("#email").type(email);
    cy.get("#password1").type(password, { log: false });
    cy.get("#password2").type(password, { log: false });
    cy.get("button").contains("Register").click();
    cy.wait("@register");

    cy.server();
    cy.visit(`/${slug}/edit`);
    cy.location("pathname").should("eq", "/");
  });

  it("Can post comments.", function () {
    const slug = Cypress.env("post")["slug"];

    login();

    cy.server();
    cy.route("POST", `**/api/blog/${slug}/comments**`).as("post");

    cy.visit(`/${slug}`);
    cy.get("#body").type("test comment");
    cy.get("button").contains("Post").click();
    cy.wait("@post");
    cy.get(".commentBody").contains("test comment");
  });

  it("Cannot post comments if not logged in.", function () {
    const slug = Cypress.env("post")["slug"];
    cy.visit(`/${slug}`);
    cy.get("#body").should("not.exist");
  });
});
