/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2023, T-Systems International GmbH
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

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useKeycloak } from '@react-keycloak/web';

import AppContext from '../../store/app-context';

interface PrivateRouteProps {
  roles?: string[];
  disabled?: boolean;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { keycloak } = useKeycloak();
  const { navigation } = useContext(AppContext);

  const [isInit, setIsInit] = React.useState(false);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  const { roles, disabled } = props;

  React.useEffect(() => {
    if (keycloak) {
      if (roles && roles.length > 0) {
        setIsAuthorized(
          roles.some((role) => {
            // In keycloak there are two ways of assiging roles to the user
            // You can assign roles to realm & client
            // In that case you have to use both scenarios with hasRealmRole & hasResourceRole
            const realm = keycloak.hasRealmRole(role);
            const resource = keycloak.hasResourceRole(role);

            return realm || resource;
          })
        );
      } else {
        // no roles set --> everybody can access
        setIsAuthorized(true);
      }

      setIsInit(true);
    }
  }, [keycloak, roles]);

  return (
    <>
      {isInit &&
        (isAuthorized && !disabled ? (
          <Outlet />
        ) : (
          <Navigate
            to={navigation?.calculatedRoutes.landing!}
            replace
          />
        ))}
    </>
  );
};

export default PrivateRoute;
