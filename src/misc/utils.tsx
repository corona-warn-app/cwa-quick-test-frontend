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

import { KeycloakInstance } from 'keycloak-js';
import CancellationSteps from './CancellationSteps';
import { ICancellation } from './useCancellation';

export interface IUtils {
  shortHashLen: number;
  pattern: { [key: string]: string | RegExp };
  shortHash: (value: string) => string;
  getIndent: (level: number) => JSX.Element[];
  pickerDateFormat: string;
  pickerDateTimeFormat: string;
  momentDateFormat: string;
  momentDateTimeFormat: string;
  hasRole: (keycloak: KeycloakInstance, role: string) => boolean;
  getCancellationStep: (cancellation?: ICancellation, cancellationCompletePendingTests?: number) => CancellationSteps;
}

const shortHashLen = 8;

const pattern = {
  processNo: '^[A-Fa-f0-9]{' + shortHashLen + '}$',
  zip: '^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$',
  houseNo: '^([1-9]{1}[0-9a-zA-Z-\\s/]{0,14})$',
  tel: '^([+]{1}[1-9]{1,2}|[0]{1}[1-9]{1})[0-9]{5,}$',
  eMail: '^[\\w\\d\\.!#$%&’*+/=?^_`{|}~-]{1,}[@]{1}[\\w\\d\\.-]{1,}[\\.]{1}[\\w]{2,}$',
  standardisedName: '^[A-Z<]*$',
  url: '^(www\\.|http:\\/\\/|https:\\/\\/){0,1}?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\/.*)?$',
  BSNR: '^[1-9]{1}\\d{8}$',
  //openingHours:'^[\\w-\\d\\s]{0,64}$/gm'
  openingHours: '^(.|\n){0,64}$',
  name: /^([\p{L}\s,-])*$/gu,
};

const getIndent = (level: number): JSX.Element[] => {
  const indent: JSX.Element[] = [];

  for (let index = 0; index < level; index++) {
    indent.push(<span key={index} className='intend' />);
  }

  return indent;
};

const hasRole = (keycloak: KeycloakInstance, role: string) =>
  keycloak && (keycloak.hasRealmRole(role) || keycloak.hasRealmRole(role));

const getCancellationStep = (
  cancellation?: ICancellation,
  cancellationCompletePendingTests?: number
): CancellationSteps => {
  let result = CancellationSteps.NO_CANCEL;

  if (cancellation) {
    result = CancellationSteps.CANCELED;

    cancellation.cancellationDate.getTime() < Date.now() && (result = CancellationSteps.DOWNLOAD_REQUESTED);

    cancellation.cancellationDate.getTime() + 60 * 60 * (cancellationCompletePendingTests || 24) * 1000 < Date.now() &&
      (result = CancellationSteps.NO_TEST_RECORD);

    cancellation.csvCreated && (result = CancellationSteps.DOWNLOAD_READY);

    cancellation.downloadLinkRequested && (result = CancellationSteps.DOWNLOADED);

    cancellation.dataDeleted && (result = CancellationSteps.DATA_DELETED);
  }

  return result;
};

const utils: IUtils = {
  shortHashLen: shortHashLen,
  pattern: pattern,
  shortHash: (uuIdHash: string) => uuIdHash.substring(0, shortHashLen),
  getIndent: getIndent,
  pickerDateFormat: 'dd.MM.yyyy',
  pickerDateTimeFormat: 'yyyy-MM-dd / hh:mm a',
  momentDateFormat: 'DD.MM.yyyy',
  momentDateTimeFormat: 'yyyy-MM-DD / hh:mm A',
  hasRole: hasRole,
  getCancellationStep: getCancellationStep,
};

export default utils;
