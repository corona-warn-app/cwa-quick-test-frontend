/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2022, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';

import LoginInterceptor from './login-interceptor.component';
import Routing from './routing.component';

import useLocalStorage from './misc/useLocalStorage';
import { useGetKeycloakConfig } from './api';
import AppContextProvider from './store/AppContextProvider';
import { useParams } from 'react-router-dom';

const Root = (props: any) => {
  const { mandant } = useParams();

  const keycloakConfig = useGetKeycloakConfig();

  const [storedMandant, setStoredMandant] = useLocalStorage('mandant', '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [keycloak, setKeycloak] = React.useState<Keycloak>();

  React.useEffect(() => {
    if (mandant && mandant !== storedMandant && !mandant.includes('&')) {
      setStoredMandant(mandant);
    }

    updateKeycloakConfig();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandant, keycloakConfig]);

  const updateKeycloakConfig = () => {
    if (keycloakConfig && storedMandant) {
      keycloakConfig.realm = storedMandant;

      setKeycloak(
        new Keycloak({
          clientId: keycloakConfig.clientId,
          url: keycloakConfig.url,
          realm: keycloakConfig.realm,
        })
      );
    }
  };

  return !keycloak ? (
    <></>
  ) : (
    <ReactKeycloakProvider
      authClient={keycloak}
      // onEvent={(event, error) => console.log(event, error)}
      initOptions={{ onLoad: 'login-required' }}
    >
      <LoginInterceptor>
        <AppContextProvider>
          <Routing />
        </AppContextProvider>
      </LoginInterceptor>
    </ReactKeycloakProvider>
  );
};

export default Root;
