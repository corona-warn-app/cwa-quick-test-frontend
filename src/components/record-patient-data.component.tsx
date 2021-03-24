import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import Patient from '../misc/patient';

const RecordPatientData = (props: any) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [firstName, setFirstName] = React.useState('');
    const [name, setName] = React.useState('');
    const [day, setDay] = React.useState<number>(0);
    const [month, setMonth] = React.useState<number>(0);
    const [year, setYear] = React.useState<number>(0);
    const [consent, setConsent] = React.useState(false);

    const [canGoNext, setCanGoNext] = React.useState(false)
    const [patient, setPatient] = React.useState<Patient>();

    React.useEffect(() => {
        if (props.patient) {
            const p = props.patient;
            setFirstName(p.firstName);
            setName(p.name);
            setDay(1);
            setMonth(1);
            setYear(1);
            setConsent(p.processingConsens);
        }
    },[])

    React.useEffect(() => {
        if(firstName.trim() !== ''
            && name.trim() !== ''
            && day !== NaN && day > 0
            && month !== NaN && month > 0
            && year !== NaN && year > 0
            && consent){
                setCanGoNext(true);
                setPatient({
                    firstName:firstName,
                    name:name,
                    dateOfBirth:new Date(),
                    processingConsens:consent
                });
            }
            else{
                setCanGoNext(false);
                setPatient(undefined);
            }
    }, [firstName, name, day, month, year, consent])

    React.useEffect(()=>{
        props.setPatient(patient);
    },[patient])

    const handleFirstNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(evt.currentTarget.value);
    }
    const handleNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setName(evt.currentTarget.value);
    }
    const handleDayChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setDay(getNumber(evt.currentTarget.value));
    }
    const handleMonthChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setMonth(getNumber(evt.currentTarget.value));
    }
    const handleYearChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setYear(getNumber(evt.currentTarget.value));
    }
    const handleConsentChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setConsent(evt.currentTarget.checked);
    }

    const getNumber = (value: string) => {
        let i: number | typeof NaN = Number.parseInt(value);

        if (isNaN(i)) {
            i = 0;
        }

        return i;
    }

    const handleClear = () => {
        setFirstName('');
        setName('');
        setDay(0);
        setMonth(0);
        setYear(0);
        setConsent(false);
    }

    return (
        <>
            <Row id='process-row'>
                <span className='font-weight-bold mr-2'>{t('translation:process')}</span>
                <span>{'{$process_nr}'}</span>
            </Row>

            <Card className='border-0 h-100 pb-3'>

                {/*
    header with title and id card query
    */}
                <Card.Header id='data-header'>
                    <Row>
                        <Col md='4'>
                            <Card.Title className='m-md-0 d-flex justify-content-center justify-content-md-start' as={'h2'} >{t('translation:record-data')}</Card.Title>
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
                            <Form.Label className='input-label' column sm='4'>{t('translation:first-name')}</Form.Label>

                            <Col sm='8' className='d-flex'>
                                <Form.Control className='align-self-center' value={firstName} onChange={handleFirstNameChange} placeholder={t('translation:first-name')} />
                            </Col>
                        </Form.Group>

                        {/* name input */}
                        <Form.Group as={Row} controlId='formNameInput'>
                            <Form.Label className='input-label' column sm='4'>{t('translation:name')}</Form.Label>

                            <Col sm='8' className='d-flex'>
                                <Form.Control className='align-self-center' value={name} onChange={handleNameChange} placeholder={t('translation:name')} />
                            </Col>
                        </Form.Group>

                        {/* date of birth input */}
                        <Form.Group as={Row} controlId='formDateInput'>
                            <Form.Label className='input-label' column sm='4'>{t('translation:date-of-birth')}</Form.Label>

                            <Col md='4' sm='8' className='d-flex'>
                                <Row className='align-self-center'>
                                    <Col className='first-col-item pr-sm-1' sm='3'><Form.Control type='number' value={day} onChange={handleDayChange} placeholder={t('translation:day')} /></Col>
                                    <Col className='px-sm-1' sm='3'><Form.Control type='number' value={month} onChange={handleMonthChange} placeholder={t('translation:month')} /></Col>
                                    <Col className='pl-sm-1' sm='6'><Form.Control type='number' value={year} onChange={handleYearChange} placeholder={t('translation:year')} /></Col>
                                </Row>
                            </Col>
                        </Form.Group>

                        {/* processing consent check box */}
                        <Form.Group as={Row} controlId='formConsentCheckbox'>
                            <Form.Label className='input-label' column sm='9' md='4'>{t('translation:processing-consent')}</Form.Label>

                            <Col xs='2' className='d-flex justify-content-center justify-content-md-start'>
                                <Form.Check className='align-self-center'>
                                    <Form.Check.Input className='position-unset' onChange={handleConsentChange} type='checkbox' checked={consent} />
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
                        <Button block onClick={handleClear} className='my-1 my-md-0 p-0'>{t('translation:clear')}</Button>
                        </Col>
                        <Col xs='6' md='3' className='pr-md-0'>
                        <Button block onClick={navigation.toShowRecordPatient} disabled={!canGoNext} className='my-1 my-md-0 p-0'>{t('translation:next')}</Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    )
}

export default RecordPatientData;