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

import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { v4 as newUuid } from 'uuid';
import sha256 from 'crypto-js/sha256';
import IQuickTest from './misc/quick-test';
import StatisticData from './misc/statistic-data';
import ITestResult from './misc/test-result';
import IQTArchiv from './misc/qt-archiv';
import { TestResult } from './misc/enum';
import DiseaseAgents from './assets/json-res/disease-agent-targeted.json';
import TestManufacturers from './assets/json-res/test-manf.json';

export const api = axios.create({
    baseURL: ''
});

const TRYS = 2;

interface IValue {
    active: boolean,
    display: string,
    lang: string,
    system: string,
    version: string
    valueSetId?: string,
}

export interface IValueSet {
    [key: string]: IValue;
}

export interface ITests {
    testBrandId: string,
    testBrandName: string
}

// Disease Agents
export const useGetDiseaseAgents = () => {

    const [diseaseAgents, setDiseaseAgents] = React.useState<IValueSet>();

    React.useEffect(() => {
        // get object via api
        // const diseaseAgentsData = getApiData('/diseaseAgents');

        // get object via public
        const diseaseAgentsData = DiseaseAgents.valueSetValues;
        setDiseaseAgents(diseaseAgentsData);
    }, [])

    return diseaseAgents;
}

// TestManufacturers
export const useGetTestManufacturers = () => {

    const [testManufacturers, setTestManufacturers] = React.useState<IValueSet>();

    React.useEffect(() => {
        // get object via api
        // const testManufacturers = getApiData('/testManufacturers');

        // get object via public
        const testManufacturers = TestManufacturers.valueSetValues;
        setTestManufacturers(testManufacturers);
    }, [])

    return testManufacturers;
}

export const usePostTestResult = (testResult: ITestResult | undefined, processId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {

        if (testResult && processId) {

            const uri = '/api/quicktest/' + processId + '/testResult';
            const body = JSON.stringify(testResult);

            const header = {
                "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
                'Content-Type': 'application/json'
            };

            api.put(uri, body, { headers: header })
                .then(response => {
                    if (onSuccess) {
                        onSuccess();
                    }
                })
                .catch(error => {
                    if (onError) {
                        onError(error);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testResult])
}

export const usePostQuickTest = (quickTest: IQuickTest | undefined, processId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {

        if (quickTest && quickTest.personData && quickTest.addressData && processId) {

            const uri = '/api/quicktest/' + processId + '/personalData';
            const body = JSON.stringify({
                confirmationCwa: quickTest.processingConsens || quickTest.includePersData || quickTest.dccConsentCwa,
                privacyAgreement: quickTest.privacyAgreement,
                lastName: quickTest.personData.familyName,
                firstName: quickTest.personData.givenName,
                birthday: quickTest.personData.dateOfBirth ? quickTest.personData.dateOfBirth.toISOString().split('T')[0] : '',
                sex: quickTest.personData.sex,
                email: quickTest.emailAddress,
                phoneNumber: quickTest.phoneNumber,
                street: quickTest.addressData.street,
                houseNumber: quickTest.addressData.houseNumber,
                zipCode: quickTest.addressData.zip,
                city: quickTest.addressData.city,
                testResultServerHash: quickTest.testResultHash ? quickTest.testResultHash : '0000000000000000000000000000000000000000000000000000000000000000',
                standardisedFamilyName: quickTest.personData.standardisedFamilyName,
                standardisedGivenName: quickTest.personData.standardisedGivenName,
                diseaseAgentTargeted: '840539006',
                dccConsent: quickTest.dccConsent,
                testType: "LP217198-3",
                dccConsentCwa: quickTest.dccConsentCwa

                // new fields 4 API

                // standardisedFamilyName: quickTest.personData.standardisedFamilyName, --> "type": "string", "pattern": "^[A-Z<]*$", "maxLength": 50,
                // standardisedGivenName: quickTest.personData.standardisedGivenName, --> "type": "string", "pattern": "^[A-Z<]*$", "maxLength": 50,
                // diseaseAgentTargeted: quickTest.personData.diseaseAgentTargeted --> immer "840539006" , "type": "string"
                // dccConsent: quickTest.dccConsent --> "type": "boolean"
                // dccConsentCwa: quickTest.dccConsentCwa --> "type": "boolean"
                // testType: quickTest.testType --> immer "LP217198-3" , "type": "string"
            });

            const header = {
                "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
                'Content-Type': 'application/json'
            };

            api.put(uri, body, { headers: header })
                .then(response => {
                    if (onSuccess) {
                        onSuccess();
                    }
                })
                .catch(error => {
                    if (onError) {
                        onError(error);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quickTest])
}

export const useGetUuid = (currentUuid: string, onSuccess?: (status: number) => void, onError?: (error: any) => void) => {

    const { keycloak, initialized } = useKeycloak();
    const [uuid, setUuid] = React.useState('');
    const [result, setResult] = React.useState<string>();
    const [uuidHash, setUuidHash] = React.useState('');
    const [isNew, setIsNew] = React.useState(true);
    const [trys, setTrys] = React.useState(0);

    // on mount
    React.useEffect(() => {
        if (currentUuid) {
            setIsNew(false);
            setUuid(currentUuid);
            setResult(currentUuid);
        }
        else {
            setUuid(newUuid());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // on new uuid
    React.useEffect(() => {
        if (uuid) {
            setUuidHash(sha256(uuid).toString());
        }
    }, [uuid]);

    // on new hash
    React.useEffect(() => {
        if (!uuidHash || uuidHash === '' || !isNew)
            return;

        const uri = '/api/quicktest';
        const body = JSON.stringify({ hashedGuid: uuidHash });
        const header = {
            "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
            'Content-Type': 'application/json'
        };

        api.post(uri, body, { headers: header })
            .then(response => {
                setResult(uuid);
                if (onSuccess) {
                    onSuccess(response?.status);
                }
            })
            .catch(error => {
                // if new uuid exists, retry
                if (error && error.response && error.response.status === 409 && trys < TRYS) {
                    setTrys(trys + 1)
                    setUuid(newUuid());
                }
                else if (onError) {
                    onError(error);
                }
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuidHash]);

    return result;
}

export const useGetTests = (onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();
    const [result, setResult] = React.useState<ITests[]>();

    const header = {
        "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
        'Content-Type': 'application/json'
    };

    React.useEffect(() => {
        api.get('/api/antigentests', { headers: header })
            .then(response => {
                setResult(response.data);
            })
            .catch(error => {
                if (onError) {
                    onError(error);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return result;
}

export const useStatistics = (onSuccess?: (status: number) => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();
    const [statisticData, setStatisticData] = React.useState<StatisticData>();

    const header = {
        "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
        'Content-Type': 'application/json'
    };

    React.useEffect(() => {
        if (!statisticData) {
            api.get('/api/quickteststatistics', { headers: header })
                .then(response => {
                    setStatisticData(response.data);
                    if (onSuccess) {
                        onSuccess(response?.status);
                    }
                })
                .catch(error => {
                    if (onError) {
                        onError(error);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return statisticData;
}

export const useGetKeycloakConfig = (onSuccess?: (status: number) => void, onError?: (error: any) => void) => {

    const [result, setResult] = React.useState<Keycloak.KeycloakConfig>();

    const header = {
        'Content-Type': 'application/json'
    };

    React.useEffect(() => {

        api.get('/api/config/keycloak.json', { headers: header })
            .then(response => {
                setResult({
                    clientId: response.data['resource'],
                    url: response.data['auth-server-url'],
                    realm: ''
                });
                if (onSuccess) {
                    onSuccess(response?.status);
                }
            })
            .catch(error => {
                if (onError) {
                    onError(error);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return result;
}
export const useGetPositiveForTimeRange = (testResult: TestResult | undefined, start: Date | undefined, end: Date | undefined, onSuccess?: (status: number) => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();
    const [result, setResult] = React.useState<IQTArchiv[]>();

    const header = {
        "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
        'Content-Type': 'application/json'
    };

    React.useEffect(() => {

        setResult(undefined);

        if (start && end) {
            let tp = '';

            if (testResult) {
                tp = 'testResult=' + testResult + '&'
            }
            const uri = '/api/quicktestarchive?' + tp + 'dateFrom=' + start.toISOString() + '&dateTo=' + end.toISOString();

            api.get(uri, { headers: header })
                .then(response => {
                    setResult(response.data.quickTestArchives);
                    if (onSuccess) {
                        onSuccess(response?.status);
                    }
                })
                .catch(error => {
                    if (onError) {
                        onError(error);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testResult, start, end]);

    return result;
}

export const useGetPDF = (hash: string | undefined, onSuccess?: (status: number) => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();
    const [result, setResult] = React.useState<string>();

    const header = {
        "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
        'Content-Type': 'application/pdf'
    };

    React.useEffect(() => {

        if (hash) {
            const uri = '/api/quicktestarchive/' + hash + '/pdf';

            api.get(uri, { headers: header, responseType: 'arraybuffer' })
                .then(response => {
                    const file = new Blob(
                        [response.data],
                        { type: 'application/pdf' });

                    setResult(URL.createObjectURL(file));
                    if (onSuccess) {
                        onSuccess(response?.status);
                    }
                })
                .catch(error => {
                    if (onError) {
                        onError(error);
                    }
                });
        }
        else {
            setResult(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    return result;
}
