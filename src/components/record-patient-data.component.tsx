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

import React from 'react';
import { Card, Form, Row } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import sha256 from 'crypto-js/sha256';

import useNavigation from '../misc/navigation';
import CwaSpinner from './spinner/spinner.component';
import utils from '../misc/utils';

import { useGetUuid } from '../api';
import PersonInputs from './modules/person-data-inputs';
import CardFooter from './modules/card-footer.component';
import CardHeader from './modules/card-header.component';
import { IAddressData, IPersonData } from '../misc/quick-test';
import AddressInputs from './modules/address-inputs';
import { FormGroupConsentCkb, FormGroupInput } from './modules/form-group.component';


const RecordPatientData = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(false)
    const [uuIdHash, setUuIdHash] = React.useState('');
    const [processId, setProcessId] = React.useState('');

    const [person, setPerson] = React.useState<IPersonData>();
    const [address, setAddress] = React.useState<IAddressData>();

    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [emailAddress, setEmailAddress] = React.useState('');
    const [consent, setConsent] = React.useState(false);
    const [dccConsent, setDccConsent] = React.useState(false);
    const [persDataInQR, setIncludePersData] = React.useState(false)
    const [privacyAgreement, setPrivacyAgreement] = React.useState(false)
    const [validated, setValidated] = React.useState(false);


    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        props.setError({ error: error, message: msg, onCancel: navigation!.toLanding });
    }

    const uuid = useGetUuid(props?.quickTest?.uuId, undefined, handleError);

    // set values from props or new uuid on mount
    React.useEffect(() => {
        if (props.quickTest) {
            const p = props.quickTest;

            setConsent(p.processingConsens);
            setIncludePersData(p.includePersData);
            setPrivacyAgreement(p.privacyAgreement);
            setPhoneNumber(p.phoneNumber);
            setEmailAddress(p.emailAddress);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.quickTest]);

    // set hash from uuid
    React.useEffect(() => {
        if (uuid) {
            setUuIdHash(sha256(uuid).toString());
        }
    }, [uuid]);

    // set process id from hash
    React.useEffect(() => {
        setProcessId(utils.shortHash(uuIdHash));
    }, [uuIdHash]);

    // set ready state for spinner
    React.useEffect(() => {
        if (processId && navigation) {
            setTimeout(setIsInit, 200, true);
        }
    }, [processId, navigation]);


    const handleConsentChange = (evt: any) => {
        if (consent) {
            setConsent(false);
        }
        else {
            setConsent(true);
        }
        setIncludePersData(false);
    }
    const handlePersDataInQRChange = (evt: any) => {
        if (persDataInQR) {
            setIncludePersData(false);
        }
        else {
            setIncludePersData(true);
        }
        setConsent(false);
    }
    const handlePrivacyAgreement = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setPrivacyAgreement(evt.currentTarget.checked);
    }

    const handleCancel = () => {
        props.setQuickTest(undefined);
        navigation!.toLanding();
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity() && person) {
            props.setQuickTest({
                personData: person,
                addressData: address,
                processingConsens: consent,
                uuId: uuid,
                includePersData: persDataInQR,
                privacyAgreement: privacyAgreement,
                phoneNumber: phoneNumber,
                emailAddress: emailAddress,
                dccConsent: dccConsent
            })
            setTimeout(navigation!.toShowRecordPatient, 200);
        }

    }

    return (
        !isInit ? <CwaSpinner /> :
            <>
                <Row id='process-row'>
                    <span className='font-weight-bold mr-2'>{t('translation:process')}</span>
                    <span>{processId}</span>
                </Row>
                <Card id='data-card'>

                    <Form className='form-flex' onSubmit={handleSubmit} validated={validated}>

                        {/*
    header with title and id card query
    */}
                        <CardHeader idCard={true} title={t('translation:record-result2')} />

                        {/*
    content area with patient inputs and check box
    */}
                        <Card.Body id='data-body' className='pt-0'>

                            <PersonInputs quickTest={props.quickTest} onChange={setPerson} />

                            <hr />

                            {/* address input */}
                            <AddressInputs quickTest={props.quickTest} onChange={setAddress} />

                            <hr />

                            {/* phone number input */}

                            < FormGroupInput controlId='formPhoneInput' title={t('translation:phone-number')}
                                value={phoneNumber}
                                onChange={(evt: any) => setPhoneNumber(evt.target.value)}
                                type='tel'
                                required
                                pattern={utils.pattern.tel}
                                maxLength={79}
                            />

                            < FormGroupInput controlId='formEmailInput' title={t('translation:email-address')}
                                value={emailAddress}
                                onChange={(evt: any) => setEmailAddress(evt.target.value)}
                                type='email'
                                required
                                pattern={utils.pattern.eMail}
                                minLength={5}
                                maxLength={255}
                            />

                            <hr />

                            {/* processing consent check box */}
                            <FormGroupConsentCkb controlId='formConsentCheckbox' title={t('translation:processing-consent-title')}
                                accordion={t('translation:processing-consent')}
                                onClick={handleConsentChange}
                                onChange={handleConsentChange}
                                type='radio'
                                name="check-radios"
                                checked={consent}
                            />
                            <FormGroupConsentCkb controlId='formKeepPrivateCheckbox' title={t('translation:patientdata-exclude-title')}
                                accordion={t('translation:patientdata-exclude')}
                                onClick={handlePersDataInQRChange}
                                onChange={handlePersDataInQRChange}
                                type='radio'
                                name="check-radios"
                                checked={persDataInQR}
                            />
                            <FormGroupConsentCkb controlId='formDataPrivacyCheckbox' title={t('translation:data-privacy-approve')}
                                onChange={(evt: any) => setPrivacyAgreement(evt.currentTarget.checked)}
                                type='checkbox'
                                checked={privacyAgreement}
                                required
                            />
                            <FormGroupConsentCkb controlId='formDccCheckbox' title={t('translation:dccConsent-title')}
                                onChange={(evt: any) => setDccConsent(evt.currentTarget.checked)}
                                type='checkbox'
                                checked={dccConsent}
                                required
                            />
                        </Card.Body>

                        {/*
    footer with clear and nex button
    */}
                        <CardFooter handleCancel={handleCancel} />

                    </Form>
                </Card>
            </>
    )
}

export default RecordPatientData;