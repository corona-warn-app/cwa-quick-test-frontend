import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom'
import QRCode from 'qrcode.react'
import sha256 from 'crypto-js/sha256'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import Patient from '../misc/patient';


enum TestResult {
    POSITIVE,
    NEGATIVE,
    FAILED
}

const RecordTestResult = (props: any) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [processNo, setProcessNo] = React.useState('');
    const [testResult, setTestResult] = React.useState<TestResult>();

    const handleProcessNoChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setProcessNo(evt.currentTarget.value);
    }

    return (
        <>
            <Card className='border-0 h-100 pb-3'>
                <Card.Header id='data-header'>
                    <Row>
                        <Col md='6'>
                            <Card.Title className='m-0 d-flex justify-content-center justify-content-md-start' as={'h2'} >{t('translation:record-result')}</Card.Title>
                        </Col>
                    </Row>
                </Card.Header>

                {/*
    content area with process number input and radios
    */}
                <Card.Body id='data-body'>
                    <Form>
                        {/* process number input */}
                        <Form.Group as={Row} controlId='formNameInput'>
                            <Form.Label className='input-label' column sm='4'>{t('translation:process-number')}</Form.Label>

                            <Col sm='6' md='4'>
                                <Form.Control value={processNo} onChange={handleProcessNoChange} placeholder={t('translation:process-number')} />
                            </Col>
                        </Form.Group>

                        {/* test result radio */}
                        <Form.Group as={Row} controlId='formNameInput'>
                            <Form.Label className='input-label' column xs='4'>{t('translation:result-positive')}</Form.Label>

                            <Col xs='8'>
                                <Form.Check
                                    type='radio'
                                    name="result-radios"
                                    id="result-radio1"
                                    checked={testResult === TestResult.POSITIVE}
                                    onChange={() => setTestResult(TestResult.POSITIVE)}
                                />
                            </Col>
                        </Form.Group>

                        {/* test result radio */}
                        <Form.Group as={Row} controlId='formNameInput'>
                            <Form.Label className='input-label' column xs='4'>{t('translation:result-negative')}</Form.Label>

                            <Col xs='8'>
                                <Form.Check
                                    type='radio'
                                    name="result-radios"
                                    id="result-radio2"
                                    checked={testResult === TestResult.NEGATIVE}
                                    onChange={() => setTestResult(TestResult.NEGATIVE)}
                                />
                            </Col>
                        </Form.Group>

                        {/* test result radio */}
                        <Form.Group as={Row} controlId='formNameInput'>
                            <Form.Label className='input-label' column xs='4'>{t('translation:result-failed')}</Form.Label>

                            <Col xs='8'>
                                <Form.Check
                                    type='radio'
                                    name="result-radios"
                                    id="result-radio3"
                                    checked={testResult === TestResult.FAILED}
                                    onChange={() => setTestResult(TestResult.FAILED)}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Card.Body>

                {/*
    footer with cancel and submit button
    */}
                <Card.Footer id='data-footer'>
                    <Row>
                        <Col sm='6' md='3'>
                            <Button block onClick={navigation.toLanding} className='my-1 my-md-0 p-0'>{t('translation:cancel')}</Button>
                        </Col>
                        <Col sm='6' md='3' className='pr-md-0'>
                            <Button block onClick={navigation.toLanding} className='my-1 my-md-0 p-0'>{t('translation:data-submit')}</Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    )
}

export default RecordTestResult;