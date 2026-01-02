describe("Users Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard/users");
  });

  it("creates a new user", () => {
    cy.contains("Add New").should("not.be.disabled").click();
    cy.contains("Add User").should("exist");
    cy.get('input[name="full_name"]').should("be.visible").type("Test User");
    cy.get('input[name="email"]').should("be.visible").type("testuser@example.com");
    cy.get('input[name="phone"]').should("be.visible").type("12345678");
    cy.contains("Menu Assistant").click({ force: true });

    cy.contains("Add User").click();

    cy.contains("Test User").should("exist");
    cy.contains("testuser@example.com").should("exist");
  });
});
