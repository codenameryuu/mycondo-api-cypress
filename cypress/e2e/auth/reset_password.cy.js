import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountPassword = Cypress.expose("ACCOUNT_PASSWORD");

const token = "57FjzFfWwqtGH6yewplboFh1RkQpPv2u";

const fakerPassword = faker.internet.password();

describe("Spec: reset password with invalid data", () => {
  it("Should be failed, case: token is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/reset-password",
      body: {
        token: null,
        password: fakerPassword,
        password_confirmation: fakerPassword,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("token");
      expect(response.body.errors.token).to.have.length.greaterThan(0);
      expect(response.body.errors.token[0].toLowerCase()).to.contain("is required");
    });
  });

  it("Should be failed, case: password is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/reset-password",
      body: {
        token: token,
        password: null,
        password_confirmation: fakerPassword,
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

  it("Should be failed, case: password confirmation is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/reset-password",
      body: {
        token: token,
        password: fakerPassword,
        password_confirmation: null,
        language: "en",
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

  it("Should be failed, case: password and password confirmation do not match", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/reset-password",
      body: {
        token: token,
        password: fakerPassword,
        password_confirmation: fakerPassword + "2",
        language: "en",
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

  it("Should be failed, case: token is invalid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/reset-password",
      body: {
        token: "invalid-token",
        password: fakerPassword,
        password_confirmation: fakerPassword,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("token invalid");
    });
  });
});

// describe("Spec: reset password with valid data", () => {
//   it("Should be success, case: all data is valid", () => {
//     cy.request({
//       method: "POST",
//       url: apiUrl + "/auth/reset-password",
//       body: {
//         token: token,
//         password: accountPassword,
//         password_confirmation: accountPassword,
//         language: "en",
//       },
//     }).then((response) => {
//       expect(response.status).to.eq(successStatusCode);
//       expect(response.body.status).to.eq(true);
//       expect(response.body.errors).to.be.null;
//     });
//   });
// });
