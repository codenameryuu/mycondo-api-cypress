import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

const url = apiUrl + "/dashboard/category";

describe("Get Category With Invalid Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "GET",
      url: url,
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });
});

describe("Get Category With Valid Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be success, case: all data is valid", () => {
    cy.request({
      method: "GET",
      url: url,
      qs: {
        limit: 10,
        "order-by": "created_at",
        sort: "desc",
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
