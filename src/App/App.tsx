import React from 'react';
import './App.scss';
import '../i18n';
import { useTranslation } from 'react-i18next';
import keycloak from '../keycloak';
import { ReactKeycloakProvider  } from '@react-keycloak/web';
import Root from '../root.component';
import Keycloak from 'keycloak-js';

const App =() => {

  const { t } = useTranslation();

  document.title = t('translation:title');

  const keycloak = Keycloak('/keycloak.json');
    keycloak.init({
          onLoad: 'login-required',
          checkLoginIframe: false}).then(authenticated => {
        if(!keycloak.authenticated) {
            return <h3>Loading ... !!!</h3>;  
        } else {
          keycloak.logout();
        }
    }).catch( (error) =>  {
      alert(error);
  });

  return (
    // <ReactKeycloakProvider authClient={ keycloak }>
    //    <Root/>
    // </ReactKeycloakProvider> 
    <div>Hallo!!!</div>
  );
}

export default App;
