import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountEmail = Cypress.expose("ACCOUNT_EMAIL");

const fakerEmail = faker.internet.email();

describe("Spec: validate email with invalid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-email",
      body: {
        email: fakerEmail,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("Should be failed, case: email is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-email",
      body: {
        email: null,
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
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
      url: apiUrl + "/auth/validate-email",
      body: {
        email: "invalid-email",
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
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

  it("Should be failed, case: email is already taken", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-email",
      body: {
        email: accountEmail,
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("already taken");
    });
  });
});

describe("Spec: validate email with valid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-email",
      body: {
        email: email,
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(successStatusCode);
      expect(response.body.status).to.eq(true);
      expect(response.body.errors).to.be.null;
    });
  });
});
