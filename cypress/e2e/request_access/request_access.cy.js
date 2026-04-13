import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountEmail = Cypress.expose("ACCOUNT_EMAIL");

const url = apiUrl + "/request-access";

const randomNumber = faker.number.int({
  min: 1,
  max: 99,
});

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const name = firstName + " " + lastName;
const email = firstName + "." + lastName + randomNumber + "@gmail.com";
const phone = faker.phone.number("81########");
const companyName = faker.company.name();

describe("Request Access With Invalid Data Spec", () => {
  it("should be failed, case: name is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: "",
        email: email,
        phone_code: "62",
        phone: phone,
        company_name: companyName,
        language: "en",
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

  it("should be failed, case: email is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: name,
        email: "",
        phone_code: "62",
        phone: phone,
        company_name: companyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("is required");
    });
  });

  it("should be failed, case: email is invalid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: name,
        email: "invalid-email",
        phone_code: "62",
        phone: phone,
        company_name: companyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("must be a valid email");
    });
  });

  it("should be failed, case: email is already taken", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: name,
        email: accountEmail,
        phone_code: "62",
        phone: phone,
        company_name: companyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("already taken");
    });
  });

  it("should be failed, case: phone code is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: name,
        email: email,
        phone_code: "",
        phone: phone,
        company_name: companyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("phone_code");
      expect(response.body.errors.phone_code).to.have.length.greaterThan(0);
      expect(response.body.errors.phone_code[0].toLowerCase()).to.contain("is required");
    });
  });

  it("should be failed, case: phone is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: name,
        email: email,
        phone_code: "62",
        phone: "",
        company_name: companyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("phone");
      expect(response.body.errors.phone).to.have.length.greaterThan(0);
      expect(response.body.errors.phone[0].toLowerCase()).to.contain("is required");
    });
  });

  it("should be failed, case: company name is required", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: name,
        email: email,
        phone_code: "62",
        phone: phone,
        company_name: "",
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("company_name");
      expect(response.body.errors.company_name).to.have.length.greaterThan(0);
      expect(response.body.errors.company_name[0].toLowerCase()).to.contain("is required");
    });
  });
});

describe("Request Access With Valid Data Spec", () => {
  it("should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: name,
        email: email,
        phone_code: "62",
        phone: phone,
        company_name: companyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(successStatusCode);
      expect(response.body.status).to.eq(true);
      expect(response.body.errors).to.be.null;
    });
  });
});
