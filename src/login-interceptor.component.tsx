import React from 'react';

import { useKeycloak } from '@react-keycloak/web';

import CwaSpinner from './components/spinner/spinner.component';


const LoginInterceptor = (props: any) => {
  
  const { keycloak, initialized } = useKeycloak();


  // on init change
  React.useEffect(() => {

    if (keycloak && initialized && !keycloak.authenticated) {
      keycloak.login();
    }

  }, [initialized, keycloak]);

  return (
    <>
      {
        initialized && keycloak.authenticated
          ? props.children
          : <CwaSpinner
          />}
    </>
  );
}

export default LoginInterceptor;
