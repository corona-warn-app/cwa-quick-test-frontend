/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2023, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the 'License'); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Used character transliteration from
 * https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
 */

import React from 'react';
import IError from '../misc/error';
import { ICancellationResponse } from '../misc/useCancellation';
import { INavigation } from '../misc/useNavigation';
import { IValueSetList } from '../misc/useValueSet';
import { IUtils } from '../misc/utils';

export interface IAppContext {
  navigation?: INavigation;
  valueSets?: IValueSetList;
  utils?: IUtils;
  cancellation?: ICancellationResponse;
  contextConfig?: any;
  initialized: boolean;
  error: IError[];
  updateCancellation?: () => void;
  updateError: (error: IError) => void;
  clearError: () => void;
}

const AppContext = React.createContext<IAppContext>({
  initialized: false,
  error: [],
  updateError: (error) => {},
  clearError: () => {},
});

export default AppContext;
