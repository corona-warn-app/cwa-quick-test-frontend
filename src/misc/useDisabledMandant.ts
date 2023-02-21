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

const useDisabledMandant = () => {
  const { contextConfig } = React.useContext(AppContext);
  const [isDisbled, setIsDisabled] = React.useState(false);
  const [disabledList, setDisabledList] = React.useState(['']);
  const [storedMandant] = useLocalStorage('mandant', '');

  // get disabled list from context config
  useEffect(() => {
    contextConfig && setDisabledList(contextConfig['disable-user-management']);
  }, [contextConfig]);

  // set disabled state if current mandant is in disabled-list
  React.useEffect(() => {
    setIsDisabled(!!(storedMandant && disabledList && disabledList.includes(storedMandant)));
  }, [storedMandant, disabledList]);

  return isDisbled;
};

export default useDisabledMandant;
