import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

const url = apiUrl + "/dashboard/category-summary";

let categoryId = null;

describe("Initialize Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("create category sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        name: "Category " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss"),
        email: faker.internet.email(),
        website: faker.internet.url(),
        phone_code: 62,
        phone: faker.phone.number("81########"),
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      categoryId = response.body.data.id;
    });
  });
});

describe("Get Summary Category By Id With Invalid Data Spec", () => {
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

  it("should be failed, case: category id is not found", () => {
    cy.request({
      method: "GET",
      url: url + "/999999999999999999999999",
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

describe("Get Summary Category By Id With Valid Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be success, case: all data is valid", () => {
    cy.request({
      method: "GET",
      url: url + "/" + categoryId,
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
