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

import { KeycloakInstance } from "keycloak-js";

export interface IUtils {
    shortHashLen: number,
    pattern: { [key: string]: string },
    shortHash: (value: string) => string,
    isProcessNoValid: (value: string) => boolean,
    isZipValid: (value: string) => boolean,
    isTelValid: (value: string) => boolean,
    isEMailValid: (value: string) => boolean,
    isStandardisedNameValid: (value: string) => boolean,
    isUrlValid: (value: string) => boolean,
    isOpeningHoursValid: (value: string) => boolean,
    getIndent: (level: number) => JSX.Element[],
    pickerDateFormat: string,
    pickerDateTimeFormat: string,
    momentDateFormat: string,
    momentDateTimeFormat: string,
    hasRole: (keycloak: KeycloakInstance, role: string) => boolean
}

const shortHashLen = 8;

const pattern = {
    processNo: '^[A-Fa-f0-9]{' + shortHashLen + '}$',
    zip: '^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$',
    houseNo: '^([1-9]{1}[0-9a-zA-Z-\\s/]{0,14})$',
    tel: '^([+]{1}[1-9]{1,2}|[0]{1}[1-9]{1})[0-9]{5,}$',
    eMail: '^[\\w\\d\\.!#$%&’*+/=?^_`{|}~-]{1,}[@]{1}[\\w\\d\\.-]{1,}[\\.]{1}[\\w]{2,}$',
    standardisedName: '^[0-9A-Z<]*$',
    url: '^(www\\.|http:\\/\\/|https:\\/\\/){0,1}?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\/.*)?$',
    BSNR: '^[1-9]{1}\\d{8}$',
    //openingHours:'^[\\w-\\d\\s]{0,64}$/gm'
    openingHours: '^(.|\n){0,64}$'
}

const processNoRegExp = new RegExp(pattern.processNo);
const zipRegExp = new RegExp(pattern.zip);
const telRegExp = new RegExp(pattern.tel);
const eMailRegExp = new RegExp(pattern.eMail);
const standardisedNameRegExp = new RegExp(pattern.standardisedName);
const urlRegExp = new RegExp(pattern.url);
const openingHoursExp = new RegExp(pattern.openingHours);

const getIndent = (level: number): JSX.Element[] => {
    const indent: JSX.Element[] = [];

    for (let index = 0; index < level; index++) {
        indent.push(<span key={index} className='intend' />);
    }

    return indent;
}

const hasRole = (keycloak: KeycloakInstance, role: string) => keycloak && (keycloak.hasRealmRole(role) || keycloak.hasRealmRole(role));

const utils: IUtils = {
    shortHashLen: shortHashLen,
    pattern: pattern,
    shortHash: (uuIdHash: string) => uuIdHash.substring(0, shortHashLen),
    isProcessNoValid: (processNo: string) => processNoRegExp.test(processNo),
    isZipValid: (zip: string) => zipRegExp.test(zip),
    isTelValid: (tel: string) => telRegExp.test(tel),
    isEMailValid: (eMail: string) => eMailRegExp.test(eMail),
    isStandardisedNameValid: (value: string) => standardisedNameRegExp.test(value),
    isUrlValid: (url: string) => urlRegExp.test(url),
    isOpeningHoursValid: (value: string) => openingHoursExp.test(value),
    getIndent: getIndent,
    pickerDateFormat: 'dd.MM.yyyy',
    pickerDateTimeFormat: 'yyyy-MM-dd / hh:mm a',
    momentDateFormat: 'DD.MM.yyyy',
    momentDateTimeFormat: 'yyyy-MM-DD / hh:mm A',
    hasRole: hasRole
}

export default utils;