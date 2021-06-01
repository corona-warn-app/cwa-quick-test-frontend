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

import IQuickTest from './quick-test';
import CryptoJS from 'crypto-js';
import vCardParser from './vCard-parser';

export interface IQRCodeValue {
    fn?: string,
    ln?: string,
    dob?: string, //"1990-01-01",   - >day of birth
    testid: string,
    timestamp: number,
    salt: string, // 32 Bit random in HEX
    hash?: string // SHA256 Hash
}

const baseUrl = 'https://s.coronawarn.app?v=1#';

export const getQrCodeValueString = (guid: string, fn?: string, ln?: string, dob?: Date) => {
    let encodedJson = '';

    const value: IQRCodeValue = {
        fn: fn,
        ln: ln,
        dob: dob ? dob.toISOString().split('T')[0] : undefined,
        testid: guid,
        timestamp: Date.now() / 1000 | 0,
        salt: CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
    }

    const shaEntry = getShaEntry(value);
    value.hash = CryptoJS.SHA256(shaEntry).toString(CryptoJS.enc.Hex);

    const json = JSON.stringify(value);
    const buffer = Buffer.from(json);

    encodedJson = buffer.toString('base64');

    return [(baseUrl + encodedJson), value.hash];
}

const getShaEntry = (value: IQRCodeValue): string => {
    let result = '';

    if (value) {

        if (value.dob && value.fn && value.ln) {
            result = `${value.dob}#${value.fn}#${value.ln}#${value.timestamp.toString()}#${value.testid}#${value.salt}`;
        }
        else {
            result = `${value.timestamp.toString()}#${value.salt}`;
        }
        console.log(result);

    }

    return result;
}

export const getQrCodeValue = (valueString: string) => {

    if (valueString) {

        const data = vCardParser(valueString)

        // console.log(data);
        // console.log(JSON.stringify(data));


        // const encodedJson = valueString.split('#')[1];

        // const json = atob(encodedJson);

        // const value: IQRCodeValue = JSON.parse(json);

        return (data);
    }
}

// export const getPatientFromScan = (data: string | null) => {
//     let result: Patient | null = null;

//     if (data) {
//         try {
//             const scanData = getQrCodeValue(data);

//             if (scanData && scanData.ln && scanData.fn && scanData.dob) {

//                 result = {
//                     name: scanData.ln,
//                     firstName: scanData.fn,
//                     dateOfBirth: new Date(scanData.dob)
//                 }
//             }
//         } catch (e) {

//             result = null;
//         }
//     }

//     return result;
// }

export const getPersonDataFromScan = (data: string | null) => {
    let result: IQuickTest | null = null;

    if (data) {
        try {
            const scanData = getQrCodeValue(data);

            if (scanData && scanData.length > 0) {

                const s = scanData[0];
                const ph = s.telephone.find((num) => num.value !== '');
                const em = s.email.find((ema) => ema.value !== '');
                result = {
                    personData: {
                        familyName: s.name.surname,
                        givenName: s.name.name,
                        standardisedGivenName: '',
                        standardisedFamilyName: '',
                        dateOfBirth: s.birthday ? new Date(s.birthday) : undefined,
                        sex: undefined
                    },
                    addressData: {
                        zip: s.address[0].value.postalCode,
                        city: s.address[0].value.city,
                        street: s.address[0].value.street,
                        houseNumber: s.address[0].value.number
                    },
                    phoneNumber: ph ? ph.value : undefined,
                    emailAddress: em ? em.value : undefined,
                }
            }
        } catch (e) {

            result = null;
        }
    }

    return result;
}

