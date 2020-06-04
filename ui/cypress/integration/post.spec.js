const login = () => {
  const { email, password } = Cypress.env('credentials');

  // Capture HTTP requests.
  cy.server();
  cy.route('POST', '**/api/login/**').as('login');

  // Log into the app.
  cy.visit('/');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password, { log: false });
  cy.get('button').contains('Login').click();
  cy.wait('@login');
};

describe('Blogging', function () {
  it('Can create a post.', function () {
    const title = 'post title';
    const tag = 'tag1'
    const body = 'post body';

    login();

    cy.server();
    cy.route('POST', '**/api/blog/**').as('create');

    cy.visit('/create')
    cy.get('#title').type(title);
    cy.get('.ReactTags__tagInputField').type(tag).type('{enter}');
    cy.get('.ql-editor').click().type(body);
    cy.get('button').contains('Post').click();
    cy.wait('@create');
    cy.location('pathname').should('eq', '/post-title');
  })

  it('Can visit a post.', function () {
    cy.visit('/post-title')
    cy.get('.postTitle').contains('post title');
  })

  it('Can edit a post if author.', function () {
    const title = 'post title';
    const tag = 'tag2'
    const body = 'post body edit';

    login();

    cy.server();
    cy.route('PUT', '**/api/blog/post-title**').as('edit');

    cy.visit('/post-title/edit')

    cy.get('.ReactTags__tagInputField').type(tag).type('{enter}');
    cy.get('.ql-editor').click().type(body);
    cy.get('button').contains('Edit post').click();
    cy.wait('@edit');
    cy.location('pathname').should('eq', '/post-title');
  })

  it ('Cannot edit post if not author.', function(){
    const { username, email, password } = Cypress.env('credentials2');

    cy.server();
    cy.route('POST', '**/api/register/**').as('register');

    cy.visit('/register')
    cy.get('#username').type(username);
    cy.get('#email').type(email);
    cy.get('#password1').type(password, { log: false });
    cy.get('#password2').type(password, { log: false });
    cy.get('button').contains('Register').click();
    cy.wait('@register');

    cy.server();
    cy.visit('/post-title/edit')
    cy.location('pathname').should('eq', '/');

  })

})