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
import Patient from './misc/patient';
import StatisticData from './misc/statistic-data';
import ITestResult from './misc/test-result';
import IQTArchiv from './misc/qt-archiv';
import { TestResult } from './misc/enum';

export const api = axios.create({
    baseURL: ''
});

const TRYS = 2;

export const usePostTestResult = (testResult: ITestResult | undefined, processId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {

        if (testResult && processId) {

            const uri = '/api/quicktest/' + processId + '/testResult';
            const body = JSON.stringify(testResult);
            // console.log(body);

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

export const usePostPatient = (patient: Patient | undefined, processId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {

        if (patient && processId) {

            const uri = '/api/quicktest/' + processId + '/personalData';
            const body = JSON.stringify({
                confirmationCwa: patient.processingConsens,
                privacyAgreement: patient.privacyAgreement,
                lastName: patient.name,
                firstName: patient.firstName,
                email: patient.emailAddress,
                phoneNumber: patient.phoneNumber,
                sex: patient.sex,
                street: patient.street,
                houseNumber: patient.houseNumber,
                zipCode: patient.zip,
                city: patient.city,
                birthday: patient.dateOfBirth.toISOString().split('T')[0],
                testResultServerHash: patient.testResultHash
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
    }, [patient])
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    return result;
}