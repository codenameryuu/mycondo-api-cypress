import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountPassword = Cypress.expose("ACCOUNT_PASSWORD");

const url = apiUrl + "/auth/validate-owner-access";

describe("Validate Owner Access With Invalid Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        password: "invalid-password",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("should be failed, case: password does not match", () => {
    cy.request({
      method: "POST",
      url: url,
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

// describe("Validate Owner Access With Valid Data Spec", () => {
//   beforeEach(() => {
//     cy.login();
//   });

//   it("should be success, case: all data is valid", () => {
//     cy.request({
//       method: "POST",
//       url: url,
//       body: {
//         password: accountPassword,
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
