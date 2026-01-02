describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the page and shows the title", () => {
    cy.contains("Login to your account").should("exist");
  });

  it("allows a user to log in", () => {
    cy.get("#email").type("soren@companyemail.com");
    cy.get("#password").type("soren11111");
    cy.get('button[type="submit"]').click();
    cy.contains("Welcome back!").should("exist");
    cy.url().should("include", "/dashboard");
  });
});
