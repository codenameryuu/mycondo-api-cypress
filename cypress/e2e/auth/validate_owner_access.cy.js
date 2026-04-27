import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountPassword = Cypress.expose("ACCOUNT_PASSWORD");

describe("Spec: validate owner access with invalid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-owner-access",
      body: {
        password: "invalid-password",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("Should be failed, case: password does not match", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-owner-access",
      body: {
        password: "invalid-password",
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.match(/does not match|doesn't match/);
    });
  });
});

describe("Spec: validate owner access with valid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-owner-access",
      body: {
        password: accountPassword,
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
