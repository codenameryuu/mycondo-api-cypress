import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

let categoryName = null;

const fakerName = "Category " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss");
const fakerEmail = faker.internet.email();
const fakerWebsite = faker.internet.url();
const fakerPhone = faker.phone.number("81########");

describe("Spec: create initial data to test", () => {
  beforeEach(() => {
    cy.login();
  });

  const fakerSampleName = "Category " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss");
  const fakerSampleEmail = faker.internet.email();
  const fakerSampleWebsite = faker.internet.url();
  const fakerSamplePhone = faker.phone.number("81########");

  it("Create category sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        name: fakerSampleName,
        email: fakerSampleEmail,
        website: fakerSampleWebsite,
        phone_code: "62",
        phone: fakerSamplePhone,
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      categoryName = response.body.data.name;
    });
  });
});

describe("Spec: create category with invalid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be failed, case: bearer access token is required", () => {
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
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("Should be failed, case: name is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        name: null,
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
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("name");
      expect(response.body.errors.name).to.have.length.greaterThan(0);
      expect(response.body.errors.name[0].toLowerCase()).to.contain("is required");
    });
  });

  it("Should be failed, case: name is exists", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        name: categoryName,
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
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("exists");
    });
  });
});

describe("Spec: create category with valid data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be success, case: all data is valid", () => {
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
      expect(response.status).to.eq(successStatusCode);
      expect(response.body.status).to.eq(true);
      expect(response.body.errors).to.be.null;
    });
  });
});
