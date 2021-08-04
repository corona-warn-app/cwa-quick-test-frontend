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
import { Card, Col, Container, Fade, Form, Image, Row } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import sha256 from 'crypto-js/sha256';

import CwaSpinner from './spinner/spinner.component';
import utils from '../misc/utils';

import { useGetUuid } from '../api';
import PersonInputs from './modules/person-data-inputs';
import CardFooter from './modules/card-footer.component';
import CardHeader from './modules/card-header.component';
import { IAddressData, IPersonData } from '../misc/quick-test';
import AddressInputs from './modules/address-inputs';
import { FormGroupConsentCkb, FormGroupDccConsentRadio, FormGroupInput, FormGroupRadio, FormGroupSexRadio } from './modules/form-group.component';
import AppContext from '../misc/appContext';
import eu_logo from "../assets/images/eu_logo.png";

const RecordPatientData = (props: any) => {

    const context = React.useContext(AppContext);
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
    const [dccNoConsent, setDccNoConsent] = React.useState(false);
    const [persDataInQR, setIncludePersData] = React.useState(false)
    const [privacyAgreement, setPrivacyAgreement] = React.useState(false)
    const [validated, setValidated] = React.useState(false);


    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        props.setError({ error: error, message: msg, onCancel: context.navigation!.toLanding });
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
            if (p.emailAddress) {
                setEmailAddress(p.emailAddress);
            }
            setDccConsent(p.dccConsent);
            setDccNoConsent(!p.dccConsent);
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
        if (processId && context.navigation && context.valueSets)
            setIsInit(true);
    }, [processId, context.navigation, context.valueSets])

    const handleDccConsentChange = (evt: any) => {
        setDccConsent(true)
        setDccNoConsent(false);
    }
    
    const handleDccNoConsentChange = (evt: any) => {
        setDccConsent(false)
        setDccNoConsent(true);
    }

    const handleConsentChange = (evt: any) => {
        setConsent(!consent)
        setIncludePersData(false);
    }

    const handlePersDataInQRChange = (evt: any) => {
        setIncludePersData(!persDataInQR);
        setConsent(false);
    }

    const handleCancel = () => {
        props.setQuickTest(undefined);
        context.navigation!.toLanding();
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
                emailAddress: emailAddress ? emailAddress : undefined,
                dccConsent: dccConsent
            })
            setTimeout(context.navigation!.toShowRecordPatient, 200);
        }

    }

    return (
        !(isInit && context && context.valueSets)
            ? <CwaSpinner />
            : <Fade appear={true} in={true} >
                <Container className='form-flex p-0 '>
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

                                {/* dccConsent */}
                                <Row className='yellow'>
                                    <Form.Label className='input-label pl-1' column xs='5' sm='3'>
                                        {t('translation:testZertifikat')}*
                                        <Image className="eu-flag ml-1" src={eu_logo} />
                                    </Form.Label>
                                    <Form.Label className='input-label' column xs='7' sm='9'>{t('translation:dccConsent')}</Form.Label>

                                    <Form.Label className='input-label' column xs='5' sm='3'></Form.Label>
                                    <Col xs='6' sm='4' className='d-flex pr-10 pb-2'>
                                        <FormGroupDccConsentRadio controlId='dccConsent-radio1' name="dccConsent-radios" title={t('translation:ja')}
                                            checked={dccConsent}
                                            onChange={handleDccConsentChange}
                                            required={true}
                                        />

                                        <FormGroupDccConsentRadio controlId='dccConsent-radio2' name="dccConsent-radios" title={t('translation:nein')}
                                            checked={dccNoConsent}
                                            onChange={handleDccNoConsentChange}
                                            required={true}
                                        />
                                    </Col>
                                </Row>

                                <hr />

                                <PersonInputs quickTest={props.quickTest} onChange={setPerson} dccConsent={dccConsent} onDccChanged={setDccConsent} />

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
                            </Card.Body>

                            {/*
    footer with clear and nex button
    */}
                            <CardFooter handleCancel={handleCancel} />

                        </Form>
                    </Card>
                </Container>
            </Fade>
    )
}

export default RecordPatientData;