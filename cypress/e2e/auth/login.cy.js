import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountEmail = Cypress.expose("ACCOUNT_EMAIL");
const accountPassword = Cypress.expose("ACCOUNT_PASSWORD");

const fakerEmail = faker.internet.email();
const fakerPassword = faker.internet.password();

describe("Spec: login with invalid data", () => {
  it("Should be failed, case: email is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/login",
      body: {
        email: null,
        password: fakerPassword,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("is required");
    });
  });

  it("Should be failed, case: email is invalid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/login",
      body: {
        email: "invalid-email",
        password: fakerPassword,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("must be a valid email");
    });
  });

  it("Should be failed, case: password is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/login",
      body: {
        email: fakerEmail,
        password: null,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("password");
      expect(response.body.errors.password).to.have.length.greaterThan(0);
      expect(response.body.errors.password[0].toLowerCase()).to.contain("is required");
    });
  });

  it("Should be failed, case: password and email does not match", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/login",
      body: {
        email: fakerEmail,
        password: fakerPassword,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.match(/does not match|doesn't match/);
    });
  });
});

describe("Spec: login with valid data", () => {
  it("Should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/login",
      body: {
        email: accountEmail,
        password: accountPassword,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(successStatusCode);
      expect(response.body.status).to.eq(true);
      expect(response.body.errors).to.be.null;
    });
  });
});
