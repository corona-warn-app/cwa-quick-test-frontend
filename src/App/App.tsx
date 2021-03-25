import React from 'react';
import './App.scss';
import '../i18n';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import CwaSpinner from '../components/spinner/spinner.component';


const App = (props: any) => {

  const { t } = useTranslation();
  const { keycloak, initialized } = useKeycloak();

  document.title = t('translation:title');


  // on init change
  React.useEffect(() => {

    if (keycloak && initialized && !keycloak.authenticated) {
      keycloak.login();
    }

  }, [initialized]);

  return (
    <>
      {initialized && keycloak.authenticated? props.children: <CwaSpinner/>}
    </>
  );
}

export default App;
