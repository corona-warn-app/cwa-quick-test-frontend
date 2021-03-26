import Keycloak from 'keycloak-js'
import React from 'react';
import API from './api'
// Initialize keycloak

const useInitKeycloak = () => {

    const [json, setJson] = React.useState('');
    const [keycloak, setKeycloak] = React.useState<Keycloak.KeycloakInstance>();

    React.useEffect(() => {

        const uri = '/api/config/keycloak.json';

        API.get(uri)
            .then((value) =>{ 
                console.log('get keycloak.json success');
                
                setJson(value.data);
            })
            .catch(()=>{
                console.log('get keycloak.json failed');
                console.log('redirect to local file');

                setJson('/keycloak.json');
            });
    }, []);

    React.useEffect(() => {
        if (json) {
            setKeycloak(Keycloak(json));
        }
    }, [json])

    return keycloak;
}

export default useInitKeycloak