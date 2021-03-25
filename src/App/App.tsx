import React from 'react';
import './App.scss';
import '../i18n';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';

const App = (props: any) => {

  const { t } = useTranslation();
  const { keycloak, initialized } = useKeycloak();

  document.title = t('translation:title');


  // on init change
  React.useEffect(() => {

    if (keycloak && initialized && !keycloak.authenticated) {
      keycloak.login();
    }

    // if(keycloak && initialized){
    //   keycloak.logout();
    // }


  }, [initialized]);

  return (
    // <ReactKeycloakProvider authClient={ keycloak }>
    //    <Root/>
    // </ReactKeycloakProvider> 
    <>
      {initialized? props.children: 'LOADING'}
    </>
  );
}

export default App;
