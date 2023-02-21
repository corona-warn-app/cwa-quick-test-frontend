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

import React, { useEffect } from 'react';
import AppContext from '../store/app-context';
import useLocalStorage from './useLocalStorage';

const useEnabledTenant = () => {
  const { contextConfig } = React.useContext(AppContext);
  const [isEnbled, setIsEnabled] = React.useState(false);
  const [enabledFlag, setEnabledFlag] = React.useState('');
  const [storedTenant] = useLocalStorage('mandant', '');

  // get disabled list from context config
  useEffect(() => {
    contextConfig && setEnabledFlag(contextConfig['enable-user-management']);
  }, [contextConfig]);

  // set disabled state if current tenant is in disabled-list
  React.useEffect(() => {
    setIsEnabled(!!(storedTenant && enabledFlag && enabledFlag === storedTenant));
  }, [storedTenant, enabledFlag]);

  return isEnbled;
};

export default useEnabledTenant;
