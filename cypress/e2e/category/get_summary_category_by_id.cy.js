import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

let categoryId = null;

const fakerName = "Category " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss");
const fakerEmail = faker.internet.email();
const fakerWebsite = faker.internet.url();
const fakerPhone = faker.phone.number("81########");

describe("Spec: create initial data to test", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Create category sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        name: fakerName,
        email: fakerEmail,
        website: fakerWebsite,
        phone_code: "62",
        phone: fakerPhone,
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

describe("Spec: get summary category by id with invalid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/dashboard/category-summary/" + categoryId,
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("Should be failed, case: category id is not found", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/dashboard/category-summary/999999999999999999999999",
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

describe("Spec: get summary category by id with valid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be success, case: all data is valid", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/dashboard/category-summary/" + categoryId,
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
