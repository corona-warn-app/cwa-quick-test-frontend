import Keycloak from 'keycloak-js'
 
// Initialize keycloak

const keycloak = Keycloak('https://quicktest-6155b8d7d3c6.coronawarn.app/api/config/keycloak.json');

export default keycloak