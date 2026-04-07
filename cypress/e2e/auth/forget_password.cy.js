import { faker } from "@faker-js/faker";

const baseUrl = "https://mycondobe.kuningan.de/api/v1";
const url = `${baseUrl}/auth/forget-password`;

const failedStatusCode = 200;
const successStatusCode = 200;

const email = faker.internet.email();

describe("Forget Password With Invalid Data Spec", () => {
  it("should be failed, case: email is required", () => {
    cy.request("POST", url, {
      email: "",
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

  it("should be failed, case: email is not found", () => {
    cy.request("POST", url, {
      email: email,
      language: "en",
    }).then((response) => {
      expect(response.status).to.eq(failedStatusCode);
      expect(response.body.status).to.eq(false);
      expect(response.body.message.toLowerCase()).to.contain("invalid login credentials");
    });
  });
});

describe("Forget Password With Valid Data Spec", () => {
  it("should be success, case: all data is valid", () => {
    cy.request("POST", url, {
      email: "fikri@kemang.sg",
      language: "en",
    }).then((response) => {
      expect(response.status).to.eq(successStatusCode);
      expect(response.body.status).to.eq(true);
      expect(response.body.message.toLowerCase()).to.contain("email sent");
      expect(response.body.errors).to.be.null;
    });
  });
});
