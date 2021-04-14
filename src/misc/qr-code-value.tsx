import { timeStamp } from 'node:console';
import React from 'react'
import Patient from './patient';

export interface IQRCodeValue {
    fn: string,
    ln: string,
    dob: string, //"1990-01-01",   - >day of birth
    guid: string,
    timestamp: number
}

const baseUrl = 'https://s.coronawarn.app?v=1#';

export const getQrCodeValueString = (guid: string, fn: string = '', ln: string = '', dob?: Date) => {

    let encodedJson = '';

    const value: IQRCodeValue = {
        fn: fn,
        ln: ln,
        dob: dob ? dob.toISOString().split('T')[0] : '',
        guid: guid,
        timestamp: Date.now()
    }

    const json = JSON.stringify(value);
    encodedJson = btoa(json);

    return (baseUrl + encodedJson);
}

export const getQrCodeValue = (valueString: string) => {

    if (valueString) {
        const encodedJson = valueString.split('#')[1];

        const json = atob(encodedJson);

        const value: IQRCodeValue = JSON.parse(json);

        return (value);
    }
}

export const getPatientFromScan = (data: string | null) => {
    let result: Patient | null = null;

    if (data) {
        try {
            const scanData = getQrCodeValue(data);


            if (scanData) {

                result = {
                    name: scanData.ln,
                    firstName: scanData.fn,
                    dateOfBirth: new Date(scanData.dob)
                }
            }
        } catch (e) {

            result = null;
        }
    }

    return result;
}

