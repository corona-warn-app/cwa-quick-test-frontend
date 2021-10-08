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
import { Card, Fade, Form } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import utils from '../misc/utils';
import { IQuickTestDccAPIResponseModel, useGetQuicktest, usePostTestResult } from '../api';
import ITestResult from '../misc/test-result';
import CwaSpinner from './spinner/spinner.component';
import CardFooter from './modules/card-footer.component';
import CardHeader from './modules/card-header.component';
import { FormGroupInput } from './modules/form-group.component';
import TestResultInputs from './modules/test-result-inputs';
import AppContext from '../misc/appContext';
import ProcessIdInput from './modals/process-input.component';

const RecordTestResult = (props: any) => {

    const context = React.useContext(AppContext);
    const { t } = useTranslation();

    const [processNo, setProcessNo] = React.useState('');
    const [processNoForModal, setProcessNoForModal] = React.useState('');
    const [testResult, setTestResult] = React.useState<ITestResult>();
    const [testResultToPost, setTestResultToPost] = React.useState<ITestResult>();

    const [validated, setValidated] = React.useState(false);
    const [isInit, setIsInit] = React.useState(false)
    const [showProcessIdInputModal, setShowProcessIdInputModal] = React.useState(true)
    const [postInProgress, setPostInProgress] = React.useState(false);



    React.useEffect(() => {
        if (context.navigation && context.valueSets)
            setIsInit(true);
    }, [context.navigation, context.valueSets])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity()) {
            setPostInProgress(true);
            setTestResultToPost(testResult);
        }
    }

    const finishProcess = () => {
        props.setNotificationShow(true);
        context.navigation!.toLanding();
        setPostInProgress(false);
    }

    const handleCancel = () => {
        context.navigation?.toLanding();
    }

    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        if (error && error.message && (error.message as string).includes('412')) {
            msg = t('translation:no-group-error');
        }
        props.setError({ error: error, message: msg, onCancel: context.navigation!.toLanding });
    }

    const handleProcessIdInputCancel = () => {
        if (!processNo) {
            context.navigation!.toLanding();
        }
    }

    const handleProcessIdInputHide = () => {
        setShowProcessIdInputModal(false);
    }

    const handleProcessIdInputClick = () => {
        setShowProcessIdInputModal(true);
        setProcessNo('');
    }

    const handleProcessIdInputChange = (processNo: string) => {
        setProcessNo(processNo);
        setProcessNoForModal(processNo);
    }

    usePostTestResult(testResultToPost, processNo, finishProcess, handleError);
    const quickTest: IQuickTestDccAPIResponseModel | undefined = useGetQuicktest(processNo, handleProcessIdInputHide, (error: any) => props.setError({ error: '', message: t('translation:error-processId-data-load'), onCancel: context.navigation!.toLanding }));

    return (<>{
        !(isInit && context && context.valueSets && processNo && !showProcessIdInputModal)
            ? <CwaSpinner />
            : <Fade appear={true} in={true} >
                <Card id='data-card'>

                    <Form className='form-flex' onSubmit={handleSubmit} validated={validated}>

                        <CardHeader title={t('translation:record-result2')} />

                        {/*
    content area with process number input and radios
    */}
                        <Card.Body id='data-body' className='pt-0'>
                            {/* process number input */}
                            < FormGroupInput controlId='formProcessInput' title={t('translation:process-number')}
                                value={processNo}
                                onChange={(evt: any) => setProcessNo(evt.currentTarget.value)}
                                onClick={handleProcessIdInputClick}
                                readOnly
                                required
                                min={utils.shortHashLen}
                                maxLength={utils.shortHashLen}
                                pattern={utils.pattern.processNo}
                            />
                            <hr />

                            <TestResultInputs
                                quickTest={quickTest}
                                hidden={quickTest === undefined}
                                onChange={setTestResult}
                            />
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
            </Fade>
    }
        <ProcessIdInput
            show={showProcessIdInputModal}
            processNo={processNoForModal}
            handleError={handleError}
            onHide={() => { }}
            onCancel={handleProcessIdInputCancel}
            onChange={handleProcessIdInputChange}
        />
    </>
    )
}

export default RecordTestResult;