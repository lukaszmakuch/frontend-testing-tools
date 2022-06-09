const { v4: uuid } = require("uuid");
const {
  makeEndpointImposterCommunicationInterface,
} = require("endpoint-imposter-utils");

function makeEIModule() {
  return {
    installIfNeeded: async function () {
      if (!this.eISessionId) {
        const eISessionId = uuid();
        this.eISessionId = eISessionId;
      }
      if (!this.endpointImposterCommunicationInterface) {
        this.endpointImposterCommunicationInterface =
          makeEndpointImposterCommunicationInterface({
            url: __ENDPOINT_IMPOSTER_ROOT__,
            sessionId: this.eISessionId,
            prefix: NAME,
          });
      }
    },

    // TODO: maybe replace it with a proxy
    release: async function (...args) {
      await this.eiInstallIfNeeded();
      await this.endpointImposterCommunicationInterface.release(...args);
    },

    expectOk: async function (...args) {
      await this.eiInstallIfNeeded();
      await this.endpointImposterCommunicationInterface.expectOk(...args);
    },

    use: async function use({} = {}) {
      await this.eiInstallIfNeeded();

      const httpApiUrl = `${__ENDPOINT_IMPOSTER_ROOT__}/${this.eISessionId}/${NAME}`;
      const errorMsg =
        "No window._testSetHttpApiUrl function found while trying to set the HTTP client up to use Endpoint Imposter";
      const setSuccessfully = await this.driver.executeScript(
        `
      if (window._testSetHttpApiUrl) {
        window._testSetHttpApiUrl(arguments[0]);
        return true;
      } else {
        console.error("${errorMsg}");
        return false;
      }
    `,
        httpApiUrl
      );
      if (!setSuccessfully) console.error(errorMsg);
    },
  };
}

module.exports = makeEIModule;
