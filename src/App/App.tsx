import React from 'react';
import './App.scss';
import '../i18n';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';

const App = (props: any) => {

  const { t } = useTranslation();
  const { keycloak, initialized } = useKeycloak();

  document.title = t('translation:title');


  // on mount
  React.useEffect(() => {

    // if (!initialized) {

    //   keycloak.init(initConfig)
    //     .then(
    //       authenticated => {

    //         if (authenticated) {
    //           console.log('Im in');
    //         }
    //         else {
    //           console.log('logout!');

    //           keycloak.logout();
    //         }
    //       })
    //     .catch((error) => {
    //       console.log('error: ' + JSON.stringify(error));
    //     });
    //}

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
