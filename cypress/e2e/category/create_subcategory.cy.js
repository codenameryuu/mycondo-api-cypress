import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

const url = apiUrl + "/dashboard/category";

let categoryId = null;
let subcategoryName = null;

const fakerName = "Subcategory " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss");
const fakerEmail = faker.internet.email();
const fakerWebsite = faker.internet.url();
const fakerPhone = faker.phone.number("81########");

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

  it("create subcategory sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        category_parent_id: categoryId,
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
      subcategoryName = response.body.data.name;
    });
  });
});

describe("Create Subcategory With Invalid Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: fakerName,
        email: fakerEmail,
        website: fakerWebsite,
        phone_code: 62,
        phone: fakerPhone,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("should be failed, case: name is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        category_parent_id: categoryId,
        name: "",
        email: fakerEmail,
        website: fakerWebsite,
        phone_code: 62,
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

  it("should be failed, case: name is exists", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        category_parent_id: categoryId,
        name: subcategoryName,
        email: fakerEmail,
        website: fakerWebsite,
        phone_code: 62,
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

describe("Create Category With Valid Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        category_parent_id: categoryId,
        name: fakerName,
        email: fakerEmail,
        website: fakerWebsite,
        phone_code: 62,
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
