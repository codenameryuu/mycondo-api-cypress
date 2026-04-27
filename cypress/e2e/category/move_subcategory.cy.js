import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");

let firstCategoryId = null;
let secondCategoryId = null;
let subcategoryId = null;

describe("Spec: create initial data to test", () => {
  beforeEach(() => {
    cy.login();
  });

  const fakerSampleFirstCategoryName = "Category " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss");
  const fakerSampleFirstCategoryEmail = faker.internet.email();
  const fakerSampleFirstCategoryWebsite = faker.internet.url();
  const fakerSampleFirstCategoryPhone = faker.phone.number("81########");

  it("Create first category sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        name: fakerSampleFirstCategoryName,
        email: fakerSampleFirstCategoryEmail,
        website: fakerSampleFirstCategoryWebsite,
        phone_code: "62",
        phone: fakerSampleFirstCategoryPhone,
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      firstCategoryId = response.body.data.id;
    });
  });

  const fakerSampleSecondCategoryName = "Category " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss");
  const fakerSampleSecondCategoryEmail = faker.internet.email();
  const fakerSampleSecondCategoryWebsite = faker.internet.url();
  const fakerSampleSecondCategoryPhone = faker.phone.number("81########");

  it("Create second category sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        name: fakerSampleSecondCategoryName,
        email: fakerSampleSecondCategoryEmail,
        website: fakerSampleSecondCategoryWebsite,
        phone_code: "62",
        phone: fakerSampleSecondCategoryPhone,
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      secondCategoryId = response.body.data.id;
    });
  });

  const fakerSampleSubcategoryName = "Subcategory " + faker.internet.username() + "-" + DateTime.now().toFormat("yyyyMMddHHmmss");
  const fakerSampleSubcategoryEmail = faker.internet.email();
  const fakerSampleSubcategoryWebsite = faker.internet.url();
  const fakerSampleSubcategoryPhone = faker.phone.number("81########");

  it("Create subcategory in first category sample", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/category",
      body: {
        category_parent_id: firstCategoryId,
        name: fakerSampleSubcategoryName,
        email: fakerSampleSubcategoryEmail,
        website: fakerSampleSubcategoryWebsite,
        phone_code: "62",
        phone: fakerSampleSubcategoryPhone,
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

describe("Spec: create initial data to test", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be failed, case: bearer access token is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/move-subcategory",
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
      url: apiUrl + "/dashboard/move-subcategory",
      body: {
        category_id: null,
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
      url: apiUrl + "/dashboard/move-subcategory",
      body: {
        category_id: firstCategoryId,
        subcategory_id: null,
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

describe("Spec: create initial data to test", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/dashboard/move-subcategory",
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
