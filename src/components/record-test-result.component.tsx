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

import { useKeycloak } from '@react-keycloak/web';
import '../i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from '../misc/navigation';
import utils from '../misc/utils';
import { TestResult } from '../misc/enum';
import { usePostTestResult } from '../api';

const RecordTestResult = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const [processNo, setProcessNo] = React.useState('');
    const [testResult, setTestResult] = React.useState<TestResult>();
    const [testResultToPost, setTestResultToPost] = React.useState<TestResult>();
    const [message, setMessage] = React.useState('');
    const [isDataTransfer, setIsDataTransfer] = React.useState(false)
    const [isInputValid, setIsInputValid] = React.useState(false);
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {
        const procValid = utils.isProcessNoValid(processNo);
        if (processNo.length > 0) {
            if (!procValid) {
                setMessage(t('translation:wrong-process-number'));
            } else {
                if (message.length > 0) {
                    setMessage("");
                }
            }
        }
        setIsInputValid(testResult != null && processNo.length > 0 && procValid);
    }, [processNo, testResult]);

    const handleProcessNoChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setProcessNo(evt.currentTarget.value);
    }

    const sendTestResult = () => {
        // TODO i18n
        setIsDataTransfer(true);
        setMessage("Daten werden übermittelt");
        fetch("/api/quicktest", {
            method: 'put',
            body: JSON.stringify({ shortHash: processNo, result: testResult }),
            headers: new Headers({
                "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
                'Content-Type': 'application/json'
            }),
        }).then(res => {
            setIsDataTransfer(false);
            if (!res.ok) {
                if (res.status == 404) {
                    setMessage(t('translation:unknown-process-number', { processNo: processNo }))
                } else {
                    setMessage(t('translation:server-error', { status: res.status }));
                    console.log("server error status: ", res.status);
                }
            } else {
                navigation.toLanding();
            }
        }, error => {
            setIsDataTransfer(false);
            if (error instanceof TypeError) {
                console.log("server not reachable");
                setMessage(t("translation:server-not-reachable"));
            } else {
                console.log("connection error" + error.message)
                setMessage(t("translation:connection-error", { message: error.message }));
            }
        });
    }

    const finishProcess = () => {
        navigation.toLanding();
    }

    React.useEffect(()=>{
        console.log(testResultToPost);
        
    }, [testResultToPost])

    const postTestResult = usePostTestResult(testResultToPost, processNo, finishProcess);

    var messageHtml = undefined;
    if (message.length > 0) {
        messageHtml = <div className="alert alert-warning">
            {message}
        </div>;
    }

    return (
        <>
            <Card id='data-card'>
                <Card.Header id='data-header' className='pb-0'>
                    <Row>
                        <Col md='6'>
                            <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:record-result2')}</Card.Title>
                        </Col>
                    </Row>
                    <hr />
                </Card.Header>

                {/*
    content area with process number input and radios
    */}
                <Card.Body id='data-body' className='pt-0'>
                    <Form>
                        {/* process number input */}
                        <Form.Group as={Row} controlId='formNameInput'>
                            <Form.Label className='input-label txt-no-wrap' column xs='5' sm='3'>{t('translation:process-number')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Form.Control
                                    className='qt-input'
                                    value={processNo}
                                    onChange={handleProcessNoChange}
                                    placeholder={t('translation:process-number')}
                                    required
                                    type='text'
                                    min={utils.shortHashLen}
                                />
                            </Col>
                        </Form.Group>

                        <hr />
                        {/* test result radio */}
                        <Form.Group as={Row} controlId='result-radio1'>
                            <Form.Label className='input-label' column xs='5' sm='3'>{t('translation:result-positive')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Form.Check className='align-self-center'>
                                    <Form.Check.Input
                                        className='rdb-input'
                                        type='radio'
                                        name="result-radios"
                                        id="result-radio1"
                                        checked={testResult === TestResult.POSITIVE}
                                        onChange={() => setTestResult(TestResult.POSITIVE)}
                                        required
                                    />
                                </Form.Check>
                            </Col>
                        </Form.Group>

                        <hr />
                        {/* test result radio */}
                        <Form.Group as={Row} controlId='result-radio2'>
                            <Form.Label className='input-label' column xs='5' sm='3'>{t('translation:result-negative')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Form.Check className='align-self-center'>
                                    <Form.Check.Input
                                        className='rdb-input'
                                        type='radio'
                                        name="result-radios"
                                        id="result-radio2"
                                        checked={testResult === TestResult.NEGATIVE}
                                        onChange={() => setTestResult(TestResult.NEGATIVE)}
                                    />
                                </Form.Check>
                            </Col>
                        </Form.Group>

                        <hr />
                        {/* test result radio */}
                        <Form.Group as={Row} controlId='result-radio3'>
                            <Form.Label className='input-label' column xs='5' sm='3'>{t('translation:result-failed')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Form.Check className='align-self-center'>
                                    <Form.Check.Input
                                        className='rdb-input'
                                        type='radio'
                                        name="result-radios"
                                        id="result-radio3"
                                        checked={testResult === TestResult.INVALID}
                                        onChange={() => setTestResult(TestResult.INVALID)} />
                                </Form.Check>
                            </Col>
                        </Form.Group>
                    </Form>
                    {messageHtml}
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
                                disabled={isDataTransfer}
                                onClick={navigation.toLanding}
                            >
                                {t('translation:cancel')}
                            </Button>
                        </Col>
                        <Col sm='6' md='3' className='pr-md-0'>
                            <Button
                                className='my-1 my-md-0 p-0'
                                block
                                disabled={isDataTransfer || !isInputValid}
                                onClick={()=>setTestResultToPost(testResult)}
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