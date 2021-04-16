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

import keycloak from './keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import Keycloak from 'keycloak-js'

import LoginInterceptor from './login-interceptor.component';
import Routing from './routing.component';

import CwaSpinner from './components/spinner/spinner.component';
import { useParams } from 'react-router';
import useLocalStorage from './misc/local-storage';

interface UrlMandant {
  mandant: string;
}

const Root = (props: any) => {
  const { mandant } = useParams<UrlMandant>();
  const [storedMandant, setStoredMandant] = useLocalStorage('mandant', '');

  React.useEffect(() => {

    if (mandant && mandant !== storedMandant) {
      setStoredMandant(mandant);
    }

    updateKeycloakConfig();

  }, [mandant]);

  const updateKeycloakConfig = ()=>{
    
  }

  return (!mandant ? <></> :
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
