import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import useInitKeycloak from './keycloak';
import CwaSpinner from './components/spinner/spinner.component';


const KeycloakWrapper = (props: any) => {
  const eventLogger = (event: unknown, error: unknown) => {
    console.log('onKeycloakEvent', event, error)
  }
  
  const tokenLogger = (tokens: unknown) => {
    console.log('onKeycloakTokens', tokens)
  }
  const keycloakInit = useInitKeycloak();
  

  return (
    keycloakInit?
    <ReactKeycloakProvider
      authClient={keycloakInit as Keycloak.KeycloakInstance}
      onEvent={eventLogger}
      onTokens={tokenLogger}
    >
      {props.children}
      </ReactKeycloakProvider>
      :<CwaSpinner/>
  );
}

export default KeycloakWrapper;
