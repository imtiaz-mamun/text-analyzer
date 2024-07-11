const session = require("express-session");
const Keycloak = require("keycloak-connect");
const path = require("path");
const memoryStore = new session.MemoryStore();

const keycloakConfig = require(path.join(__dirname, "keycloak.json"));
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

module.exports = {
  keycloak,
  memoryStore,
};
