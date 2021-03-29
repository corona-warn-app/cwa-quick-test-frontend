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
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from '../misc/navigation';

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
                            <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:record-result')}</Card.Title>
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

                            <Col sm='6' md='4' className='d-flex'>
                                <Form.Control
                                    className='align-self-center'
                                    value={processNo}
                                    onChange={handleProcessNoChange}
                                    placeholder={t('translation:process-number')}
                                />
                            </Col>
                        </Form.Group>

                        {/* test result radio */}
                        <Form.Group as={Row} controlId='formNameInput'>
                            <Form.Label className='input-label' column xs='4'>{t('translation:result-positive')}</Form.Label>

                            <Col xs='8' className='d-flex'>
                                <Form.Check
                                    className='align-self-center'
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

                            <Col xs='8' className='d-flex'>
                                <Form.Check
                                    className='align-self-center'
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

                            <Col xs='8' className='d-flex'>
                                <Form.Check
                                    className='align-self-center'
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
                            <Button
                                className='my-1 my-md-0 p-0'
                                block
                                onClick={navigation.toLanding}
                            >
                                {t('translation:cancel')}
                            </Button>
                        </Col>
                        <Col sm='6' md='3' className='pr-md-0'>
                            <Button
                                className='my-1 my-md-0 p-0'
                                block
                                onClick={navigation.toLanding}
                            >
                                {t('translation:data-submit')}
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    )
}

export default RecordTestResult;