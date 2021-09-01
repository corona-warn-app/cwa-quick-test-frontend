/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2021, T-Systems International GmbH
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
import { useParams } from 'react-router';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js'

import LoginInterceptor from './login-interceptor.component';
import Routing from './routing.component';

import useLocalStorage from './misc/useLocalStorage';
import { useGetContextConfig, useGetKeycloakConfig } from './api';

interface UrlMandant {
  mandant: string;
}

const Root = (props: any) => {

  const { mandant } = useParams<UrlMandant>();

  const keycloakConfig = useGetKeycloakConfig();
  const contextConfig = useGetContextConfig();

  const [storedMandant, setStoredMandant] = useLocalStorage('mandant', '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dccRulesService, setDccRulesServices] = useLocalStorage('dccRulesService', '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [environmentName, setEnvironmentName] = useLocalStorage('environmentName', '');

  const [keycloak, setKeycloak] = React.useState<Keycloak.KeycloakInstance>();


  React.useEffect(() => {

    if (mandant && mandant !== storedMandant && !mandant.includes('&')) {
      setStoredMandant(mandant);
    }

    updateKeycloakConfig();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandant, keycloakConfig]);

  React.useEffect(() => {
    if (contextConfig) {

      if (contextConfig['rules-server-url']) {
        setDccRulesServices(contextConfig['rules-server-url']);
      }

      if (contextConfig['environment-name']) {
        setEnvironmentName(contextConfig['environment-name']);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextConfig])


  const updateKeycloakConfig = () => {

    if (keycloakConfig && storedMandant) {

      keycloakConfig.realm = storedMandant;

      setKeycloak(Keycloak(keycloakConfig));

    }

  }

  return (!keycloak ? <></> :
    <ReactKeycloakProvider
      authClient={keycloak}
    >
      <LoginInterceptor>
        <Routing />
      </LoginInterceptor>
    </ReactKeycloakProvider>
  );
}

export default Root;
