import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

const url = apiUrl + "/dashboard/move-subcategory";

let firstCategoryId = null;
let secondCategoryId = null;
let subcategoryId = null;

describe("Initialize Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("create first category sample", () => {
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
      firstCategoryId = response.body.data.id;
    });
  });

  it("create second category sample", () => {
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
      secondCategoryId = response.body.data.id;
    });
  });

  it("create subcategory in first category sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        category_parent_id: firstCategoryId,
        name: "Subcategory " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss"),
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
      subcategoryId = response.body.data.id;
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
        category_id: firstCategoryId,
        subcategory_id: subcategoryId,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
    });
  });

  it("should be failed, case: category id is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        category_id: "",
        subcategory_id: subcategoryId,
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

  it("should be failed, case: subcategory id is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        category_id: firstCategoryId,
        subcategory_id: "",
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

describe("Create Category With Valid Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        category_id: secondCategoryId,
        subcategory_id: subcategoryId,
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
