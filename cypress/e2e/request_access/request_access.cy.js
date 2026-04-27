import { faker } from "@faker-js/faker";

const apiUrl = Cypress.expose("API_URL");
const failedStatusCode = Cypress.expose("FAILED_STATUS_CODE");
const successStatusCode = Cypress.expose("SUCCESS_STATUS_CODE");
const accountEmail = Cypress.expose("ACCOUNT_EMAIL");

const fakerFirstName = faker.person.firstName();
const fakerLastName = faker.person.lastName();
const fakerName = fakerFirstName + " " + fakerLastName;
const fakerEmail = fakerFirstName + "." + fakerLastName + faker.number.int({ min: 1, max: 99 }) + "@gmail.com";
const fakerPhone = faker.phone.number("81########");
const fakerCompanyName = faker.company.name();

describe("Spec: request access with invalid data", () => {
  it("Should be failed, case: name is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: null,
        email: fakerEmail,
        phone_code: "62",
        phone: fakerPhone,
        company_name: fakerCompanyName,
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

  it("Should be failed, case: email is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: fakerName,
        email: null,
        phone_code: "62",
        phone: fakerPhone,
        company_name: fakerCompanyName,
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

  it("Should be failed, case: email is invalid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: fakerName,
        email: "invalid-email",
        phone_code: "62",
        phone: fakerPhone,
        company_name: fakerCompanyName,
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

  it("Should be failed, case: email is already taken", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: fakerName,
        email: accountEmail,
        phone_code: "62",
        phone: fakerPhone,
        company_name: fakerCompanyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("already taken");
    });
  });

  it("Should be failed, case: phone code is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: fakerName,
        email: fakerEmail,
        phone_code: null,
        phone: fakerPhone,
        company_name: fakerCompanyName,
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

  it("Should be failed, case: phone is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: fakerName,
        email: fakerEmail,
        phone_code: "62",
        phone: null,
        company_name: fakerCompanyName,
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

  it("Should be failed, case: company name is required", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: fakerName,
        email: fakerEmail,
        phone_code: "62",
        phone: fakerPhone,
        company_name: null,
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

describe("Spec: request access with valid data", () => {
  it("Should be success, case: all data is valid", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/request-access",
      body: {
        name: fakerName,
        email: fakerEmail,
        phone_code: "62",
        phone: fakerPhone,
        company_name: fakerCompanyName,
        language: "en",
      },
    }).then((response) => {
      expect(response.status).to.eq(successStatusCode);
      expect(response.body.status).to.eq(true);
      expect(response.body.errors).to.be.null;
    });
  });
});
