import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

const token = "57FjzFfWwqtGH6yewplboFh1RkQpPv2u";

describe("Spec: validate token owner with invalid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-token-owner",
      body: {
        token: token,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("Should be failed, case: token is invalid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/auth/validate-token-owner",
      body: {
        token: "invalid-token",
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("not found");
    });
  });
});

// describe("Spec: validate token owner with valid data", () => {
//   beforeEach(() => {
//     cy.login();
//   });

//   it("Should be success, case: all data is valid", () => {
//     cy.request({
//       method: "POST",
//       url: apiUrl + "/auth/validate-token-owner",
//       body: {
//         token: token,
//         language: "en",
//       },
//       headers: {
//         Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
//       },
//     }).then((response) => {
//       expect(response.status).to.eq(successStatusCode);
//       expect(response.body.status).to.eq(true);
//       expect(response.body.errors).to.be.null;
//     });
//   });
// });
