import Keycloak from 'keycloak-js'
import API from './api'
// Initialize keycloak

const InitKeycloak = () => {

    let json;

    const uri = '/api/config/keycloak.json';

    API.get(uri)
        .then((value) => json = value.data)
        .catch(/*error*/);

    return Keycloak(json);
}

export default InitKeycloak