import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountEmail = Cypress.expose("ACCOUNT_EMAIL");
const accountPassword = Cypress.expose("ACCOUNT_PASSWORD");

const url = apiUrl + "/auth/login";

const email = faker.internet.email();
const password = faker.internet.password();

describe("Login With Invalid Data Spec", () => {
  it("should be failed, case: email is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        email: "",
        password: password,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("email field is required");
    });
  });

  it("should be failed, case: email is invalid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        email: "invalid-email",
        password: password,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("email must be a valid email address");
    });
  });

  it("should be failed, case: password is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        email: email,
        password: "",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("password");
      expect(response.body.errors.password).to.have.length.greaterThan(0);
      expect(response.body.errors.password[0].toLowerCase()).to.contain("password field is required");
    });
  });

  it("should be failed, case: credentials are invalid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        email: email,
        password: password,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("password and email doesn't match");
    });
  });
});

describe("Login With Valid Data Spec", () => {
  it("should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: url,
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
