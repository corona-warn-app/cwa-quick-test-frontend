/*
 * Corona-Warn-App / cwa-log-upload
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
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import DatePicker from 'react-date-picker';
import { v4 as uuid } from 'uuid';
import sha256 from 'crypto-js/sha256';

import useNavigation from '../misc/navigation';
import Patient from '../misc/patient';
import CwaSpinner from './spinner/spinner.component';

const RecordPatientData = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(false)
    const [uuId, setUuId] = React.useState('');
    const [uuIdHash, setUuIdHash] = React.useState('');
    const [processId, setProcessId] = React.useState('');

    const [firstName, setFirstName] = React.useState('');
    const [name, setName] = React.useState('');
    const [dateOfBirth, setDateOfBirth] = React.useState<Date>();
    const [consent, setConsent] = React.useState(false);

    const [canGoNext, setCanGoNext] = React.useState(false)
    const [patient, setPatient] = React.useState<Patient>();

    // set values from props or new uuid on mount
    React.useEffect(() => {
        if (props.patient) {
            const p = props.patient;
            setFirstName(p.firstName);
            setName(p.name);
            setDateOfBirth(p.dateOfBirth);
            setConsent(p.processingConsens);
            setUuId(p.uuId);
        }
        else {
            newUuId();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // set hash from uuid
    React.useEffect(() => {
        if (uuId) {
            setUuIdHash(sha256(uuId).toString());
        }
    }, [uuId]);

    // set process id from hash
    React.useEffect(() => {
        setProcessId(uuIdHash.substring(0, 6));
    }, [uuIdHash]);

    // set ready state for spinner
    React.useEffect(() => {
        if (processId) {
            setTimeout(setIsInit, 200, true);
        }
    }, [processId]);

    // check completness on value change
    React.useEffect(() => {
        if (firstName.trim() !== ''
            && name.trim() !== ''
            && dateOfBirth !== undefined
            && consent
            && uuId) {
            setCanGoNext(true);
            setPatient({
                firstName: firstName,
                name: name,
                dateOfBirth: dateOfBirth,
                processingConsens: consent,
                uuId: uuId
            });
        }
        else {
            setCanGoNext(false);
            setPatient(undefined);
        }
    }, [firstName, name, dateOfBirth, consent, uuId])

    // emit patient object to parent
    React.useEffect(() => {
        props.setPatient(patient);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patient])

    // on input chnage
    const handleFirstNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(evt.currentTarget.value);
    }
    const handleNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setName(evt.currentTarget.value);
    }
    const handleDateChange = (evt: Date | Date[]) => {
        let date: Date;

        if (Array.isArray(evt))
            date = evt[0];
        else
            date = evt as Date;

        setDateOfBirth(date);
    }
    const handleConsentChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setConsent(evt.currentTarget.checked);
    }

    // clear patient data
    const handleClear = () => {
        setFirstName('');
        setName('');
        setDateOfBirth(undefined);
        setConsent(false);
        setPatient(undefined);
        newUuId();
    }

    // generate and set new uuid
    const newUuId = () => {
        setUuId(uuid());
    }

    return (
        !isInit ? <CwaSpinner /> :
            <>
                <Row id='process-row'>
                    <span className='font-weight-bold mr-2'>{t('translation:process')}</span>
                    <span>{processId}</span>
                </Row>

                <Card className='border-0 h-100 pb-3'>

                    {/*
    header with title and id card query
    */}
                    <Card.Header id='data-header'>
                        <Row>
                            <Col md='4'>
                                <Card.Title className='m-md-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:record-data')}</Card.Title>
                            </Col>
                            <Col md='8' className='d-flex justify-content-center'>
                                <Card.Text id='id-query-text'>{t('translation:query-id-card')}</Card.Text>
                            </Col>
                        </Row>
                    </Card.Header>

                    {/*
    content area with patient inputs and check box
    */}
                    <Card.Body id='data-body'>
                        <Form>
                            {/* first name input */}
                            <Form.Group as={Row} controlId='formNameInput'>
                                <Form.Label className='input-label' column xs='5' sm='4'>{t('translation:first-name')}</Form.Label>

                                <Col xs='7' sm='8' className='d-flex'>
                                    <Form.Control
                                        className='align-self-center'
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                        placeholder={t('translation:first-name')}
                                    />
                                </Col>
                            </Form.Group>

                            {/* name input */}
                            <Form.Group as={Row} controlId='formNameInput'>
                                <Form.Label className='input-label' column xs='5' sm='4'>{t('translation:name')}</Form.Label>

                                <Col xs='7' sm='8' className='d-flex'>
                                    <Form.Control
                                        className='align-self-center'
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder={t('translation:name')}
                                    />
                                </Col>
                            </Form.Group>

                            {/* date of birth input */}
                            <Form.Group as={Row} controlId='formDateInput'>
                                <Form.Label className='input-label' column xs='7' sm='4'>{t('translation:date-of-birth')}</Form.Label>

                                <Col xs='5' sm='8' className='d-flex'>
                                    <DatePicker
                                        onChange={handleDateChange}
                                        value={dateOfBirth}
                                        locale='de-DE'
                                        format='dd. MM. yyyy'
                                        calendarIcon={null}
                                        clearIcon={null}
                                        maxDate={new Date()}
                                        minDate={new Date(1900, 0, 1)}
                                        closeCalendar={false}
                                        returnValue='end'
                                    />
                                </Col>
                            </Form.Group>

                            {/* processing consent check box */}
                            <Form.Group as={Row} controlId='formConsentCheckbox'>
                                <Form.Label className='input-label' column sm='9' md='4'>{t('translation:processing-consent')}</Form.Label>

                                <Col xs='2' className='jcc-xs-jcfs-md'>
                                    <Form.Check className='align-self-center'>
                                        <Form.Check.Input
                                            className='position-inherit'
                                            onChange={handleConsentChange}
                                            type='checkbox'
                                            checked={consent}
                                        />
                                    </Form.Check>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>

                    {/*
    footer with clear and nex button
    */}
                    <Card.Footer id='data-footer'>
                        <Row>
                            <Col xs='6' md='3'>
                                <Button
                                    className='my-1 my-md-0 p-0'
                                    block
                                    onClick={handleClear}
                                >
                                    {t('translation:clear')}
                                </Button>
                            </Col>
                            <Col xs='6' md='3' className='pr-md-0'>
                                <Button
                                    className='my-1 my-md-0 p-0'
                                    block
                                    onClick={navigation.toShowRecordPatient}
                                    disabled={!canGoNext}
                                >
                                    {t('translation:next')}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </>
    )
}

export default RecordPatientData;