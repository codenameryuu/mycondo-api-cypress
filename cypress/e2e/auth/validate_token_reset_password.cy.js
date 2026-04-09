import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

const url = apiUrl + "/auth/validate-token-reset-password";

const token = "57FjzFfWwqtGH6yewplboFh1RkQpPv2u";

describe("Validate Token Reset Password With Invalid Data Spec", () => {
  it("should be failed, case: token is required", () => {
    cy.request({
      method: "GET",
      url: url,
      qs: {
        token: "",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("token");
      expect(response.body.errors.token).to.have.length.greaterThan(0);
      expect(response.body.errors.token[0].toLowerCase()).to.contain("token field is required");
    });
  });

  it("should be failed, case: token is invalid", () => {
    cy.request({
      method: "GET",
      url: url,
      qs: {
        token: "invalid-token",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("token invalid");
    });
  });
});

// describe("Validate Token Reset Password With Valid Data Spec", () => {
//   it("should be success, case: all data is valid", () => {
//     cy.request({
//       method: "GET",
//       url: url,
//       qs: {
//         token: token,
//         language: "en",
//       },
//     }).then((response) => {
//       expect(response.status).to.eq(successStatusCode);
//       expect(response.body.status).to.eq(true);
//       expect(response.body.errors).to.be.null;
//     });
//   });
// });
