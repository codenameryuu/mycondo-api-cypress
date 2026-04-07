import { faker } from "@faker-js/faker";

const baseUrl = "https://mycondobe.kuningan.de/api/v1";
const url = `${baseUrl}/auth/login`;

const failedStatusCode = 200;
const successStatusCode = 200;

const email = faker.internet.email();
const password = faker.internet.password();

describe("Login With Invalid Data Spec", () => {
  it("should be failed, case: email is required", () => {
    cy.request("POST", url, {
      email: "",
      password: password,
      language: "en",
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("email field is required");
    });
  });

  it("should be failed, case: email is invalid", () => {
    cy.request("POST", url, {
      email: "invalid-email",
      password: password,
      language: "en",
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email).to.have.length.greaterThan(0);
      expect(response.body.errors.email[0].toLowerCase()).to.contain("email must be a valid email address");
    });
  });

  it("should be failed, case: password is required", () => {
    cy.request("POST", url, {
      email: email,
      password: "",
      language: "en",
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.errors).to.not.be.null;
      expect(response.body.errors).to.have.property("password");
      expect(response.body.errors.password).to.have.length.greaterThan(0);
      expect(response.body.errors.password[0].toLowerCase()).to.contain("password field is required");
    });
  });

  it("should be failed, case: credentials are invalid", () => {
    cy.request("POST", url, {
      email: email,
      password: password,
      language: "en",
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("password and email doesn't match");
    });
  });
});

describe("Login With Valid Data Spec", () => {
  it("should be success, case: all data is valid", () => {
    cy.request("POST", url, {
      email: "fikri@kemang.sg",
      password: "Brian720hz@",
      language: "en",
    }).then((response) => {
      expect(response.status).to.eq(successStatusCode);
      expect(response.body.status).to.eq(true);
      expect(response.body.message.toLowerCase()).to.contain("login success");
      expect(response.body.data).to.not.be.null;
      expect(response.body.errors).to.be.null;
    });
  });
});
