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
import { Card, Col, Form, Row } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from '../misc/navigation';
import utils from '../misc/utils';
import { TestResult } from '../misc/enum';
import { ITests, useGetTests, usePostTestResult } from '../api';
import ITestResult from '../misc/test-result';
import useLocalStorage from '../misc/local-storage';
import CwaSpinner from './spinner/spinner.component';
import CardFooter from './modules/card-footer.component';
import CardHeader from './modules/card-header.component';

const RecordTestResult = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const [processNo, setProcessNo] = React.useState('');
    const [testResult, setTestResult] = React.useState<TestResult>();
    const [testResultToPost, setTestResultToPost] = React.useState<ITestResult>();
    const [testId, setTestId] = useLocalStorage('testId', '');
    const [testName, setTestName] = useLocalStorage('testName', '');

    const [validated, setValidated] = React.useState(false);
    const [isInit, setIsInit] = React.useState(false)
    const [postInProgress, setPostInProgress] = React.useState(false);

    const tests = useGetTests();

    React.useEffect(() => {
        if (navigation)
            setIsInit(true);
    }, [navigation])

    const handleProcessNoChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setProcessNo(evt.currentTarget.value);
    }

    const handleTestChange = (evt: any, change: (str: string) => void) => {
        const value = evt.currentTarget.value;

        if (tests && value) {
            const id = (value as string).slice(0, 8);
            const name = (value as string).slice(11);
            console.log(id);
            console.log(name);

            const find = tests.find((item) => item.testBrandName === name && item.testBrandId === id);
            if (find) {
                setTestId(find.testBrandId);
                setTestName(find.testBrandName);
            }
            else {
                change(value)
            }
        }
        else {
            change(value)
        }
    }

    const handleTestIdChange = (evt: any) => {
        handleTestChange(evt, setTestId);
    }
    const handleTestNameChange = (evt: any) => {
        handleTestChange(evt, setTestName);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity()) {
            setPostInProgress(true);
            setTestResultToPost({
                result: testResult!,
                testBrandId: testId,
                testBrandName: testName
            })
        }

    }

    const finishProcess = () => {
        props.setNotificationShow(true);
        navigation!.toLanding();
        setPostInProgress(false);
    }

    const handleCancel = () => {
        navigation?.toLanding();
    }

    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        props.setError({ error: error, message: msg, onCancel: navigation!.toLanding });
    }

    usePostTestResult(testResultToPost, processNo, finishProcess, handleError);

    return (!isInit ? <CwaSpinner /> :
        <>
            <Card id='data-card'>

                <Form className='form-flex' onSubmit={handleSubmit} validated={validated}>

                    <CardHeader title={t('translation:record-result2')} />

                    {/*
    content area with process number input and radios
    */}
                    <Card.Body id='data-body' className='pt-0'>
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
                                    maxLength={utils.shortHashLen}
                                    pattern={utils.pattern.processNo}
                                />
                            </Col>
                        </Form.Group>
                        <hr />

                        {/* test-ID input */}
                        <Form.Group as={Row} controlId='formTestIdInput'>
                            <Form.Label className='input-label' column xs='5' sm='3'>{t('translation:test-id')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Form.Control
                                    className='qt-input'
                                    value={testId}
                                    onChange={handleTestIdChange}
                                    placeholder={t('translation:test-id')}
                                    type='text'
                                    list='testid-list'
                                    required
                                />
                                <datalist id="testid-list">
                                    {tests ? tests.map((i: ITests) => <option key={i.testBrandId} value={i.testBrandId + ' - ' + i.testBrandName} />) : undefined}
                                </datalist>

                            </Col>
                        </Form.Group>

                        <hr />
                        {/* test-name input */}
                        <Form.Group as={Row} controlId='formTestNameInput'>
                            <Form.Label className='input-label' column xs='5' sm='3'>{t('translation:test-name')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Form.Control
                                    className='qt-input'
                                    value={testName}
                                    onChange={handleTestNameChange}
                                    placeholder={t('translation:test-name')}
                                    type='text'
                                    list='testname-list'
                                    required
                                    maxLength={255}
                                />
                                <datalist id="testname-list">
                                    {tests ? tests.map((i: ITests) => <option key={i.testBrandId} value={i.testBrandId + ' - ' + i.testBrandName} />) : undefined}
                                </datalist>
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
                    </Card.Body>

                    {/*
    footer with cancel and submit button
    */}
                    <CardFooter
                        okText={t('translation:data-submit')}
                        handleCancel={handleCancel}
                        disabled={postInProgress}
                    />
                </Form>

            </Card>
        </>
    )
}

export default RecordTestResult;