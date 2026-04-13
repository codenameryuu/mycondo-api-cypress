import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

const url = apiUrl + "/validate-request-access-token";

const token = "57FjzFfWwqtGH6yewplboFh1RkQpPv2u";

describe("Validate Request Access Token With Invalid Data Spec", () => {
  it("should be failed, case: token is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        token: "",
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

  it("should be failed, case: token is invalid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        token: "invalid-token",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("invalid");
    });
  });
});

// describe("Validate Request Access Token With Valid Data Spec", () => {
//   it("should be success, case: all data is valid", () => {
//     cy.request({
//       method: "POST",
//       url: url,
//       body: {
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
