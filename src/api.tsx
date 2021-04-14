import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { v4 as newUuid } from 'uuid';
import sha256 from 'crypto-js/sha256';
import Patient from './misc/patient';
import { TestResult } from './misc/enum';

export const api = axios.create({
    baseURL: ''
});

const TRYS = 2;

export const usePostTestResult = (testResult: TestResult|undefined, processId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {

        if (testResult && processId) {

            const uri = 'api/quicktest/' + processId + '/testResult';
            const body = JSON.stringify({
                result: testResult
            });

            console.log(body);

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
    }, [testResult])
}

export const usePostPatient = (patient: Patient|undefined, processId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {

        if (patient && processId) {

            const uri = 'api/quicktest/' + processId + '/personalData';
            const body = JSON.stringify({
                confirmationCwa: patient.includePersData,
                insuranceBillStatus: patient.processingConsens,
                testBrandId: patient.testId,
                lastName: patient.name,
                firstName: patient.firstName,
                email: patient.emailAddress,
                phoneNumber: patient.phoneNumber,
                sex: patient.sex,
                street: patient.street,
                houseNumber: patient.houseNumber,
                zipCode: patient.zip,
                city: patient.city
            });

            console.log(body);

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

        const uri = 'api/quicktest';
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

    }, [uuidHash]);

    return result;
}