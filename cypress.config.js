const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "custom-title",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    expose: {
      API_URL: "https://mycondobe.kuningan.de/api/v1",
      SUCCESS_STATUS_CODE: 200,
      FAILED_STATUS_CODE: 200,
      ACCOUNT_EMAIL: "fikri@kemang.sg",
      ACCOUNT_PASSWORD: "fikrisabriansyah123@",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});
