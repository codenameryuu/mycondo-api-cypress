import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountPassword = Cypress.expose("ACCOUNT_PASSWORD");

const url = apiUrl + "/auth/change-password";

describe("Change password with invalid data spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("It should be failed: bearer access token is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        password: "newpassword",
        password_confirmation: "newpassword",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("It should be failed: password is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        password: "",
        password_confirmation: "newpassword",
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
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

  it("It should be failed: password confirmation is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        password: "newpassword",
        password_confirmation: "",
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("password_confirmation");
      expect(response.body.errors.password_confirmation).to.have.length.greaterThan(0);
      expect(response.body.errors.password_confirmation[0].toLowerCase()).to.contain("is required");
    });
  });

  it("It should be failed: password and password confirmation do not match", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        password: "newpassword",
        password_confirmation: "newpassword2",
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("password_confirmation");
      expect(response.body.errors.password_confirmation).to.have.length.greaterThan(0);
      expect(response.body.errors.password_confirmation[0].toLowerCase()).to.contain("must match");
    });
  });
});

describe("Change password with valid data spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("It should be success: all data is valid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        password: accountPassword,
        password_confirmation: accountPassword,
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
