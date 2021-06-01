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
import { Card, Col, Container, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from '../misc/navigation';
import IQuickTest from '../misc/quick-test';

import Moment from 'react-moment';
import sha256 from 'crypto-js/sha256';
import QRCode from 'qrcode.react';
import utils from '../misc/utils';

import CwaSpinner from './spinner/spinner.component';
import { Sex } from '../misc/enum';
import { getQrCodeValueString } from '../misc/qr-code-value';
import { usePostQuickTest } from '../api';
import CardFooter from './modules/card-footer.component';

const ShowPatientData = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(false)
    const [quickTest, setQuickTest] = React.useState<IQuickTest>();
    const [quickTestToPost, setQuickTestToPost] = React.useState<IQuickTest>();
    const [qrCodeValue, setQrCodeValue] = React.useState<string[]>();
    const [uuIdHash, setUuIdHash] = React.useState('');
    const [processId, setProcessId] = React.useState('');
    const [postInProgress, setPostInProgress] = React.useState(false);

    // set quickTest data on mount and set hash from uuid
    React.useEffect(() => {
        console.log(JSON.stringify(props));
        if (isInit) {
            if (props.quickTest) {
                setQuickTest(props.quickTest)
            }
            else
                props.setError({ error: '', message: t('translation:error-patient-data-load'), onCancel: navigation!.toLanding });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInit])

    React.useEffect(() => {
        if (quickTest && quickTest.personData && quickTest.uuId) {
            setUuIdHash(sha256(quickTest.uuId).toString());

            if (quickTest.includePersData) {

                setQrCodeValue(getQrCodeValueString(quickTest.uuId, quickTest.personData.givenName, quickTest.personData.familyName, quickTest.personData.dateOfBirth));
            }
            if (quickTest.processingConsens) {
                setQrCodeValue(getQrCodeValueString(quickTest.uuId));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quickTest])

    // set process id from hash
    React.useEffect(() => {
        if (uuIdHash) {
            setProcessId(utils.shortHash(uuIdHash));
        }
    }, [uuIdHash]);


    React.useEffect(() => {
        if (qrCodeValue && qrCodeValue.length > 1) {
            quickTest!.testResultHash = qrCodeValue[1];
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qrCodeValue]);

    // set ready state for spinner
    React.useEffect(() => {
        if (navigation) {
            setTimeout(setIsInit, 200, true);
        }
    }, [navigation]);

    const finishProcess = () => {
        props.setQuickTest(undefined);
        props.setNotificationShow(true);
        navigation!.toLanding();
        setPostInProgress(false);
    }

    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        props.setError({ error: error, message: msg, onCancel: navigation!.toLanding });
    }

    usePostQuickTest(quickTestToPost, processId, finishProcess, handleError);

    const handlePost = () => {
        setPostInProgress(true);
        setQuickTestToPost(quickTest);
    }

    return (
        !(isInit && quickTest && quickTest.personData && quickTest.addressData) ? <CwaSpinner /> :
            <>
                <Row id='process-row'>
                    <span className='font-weight-bold mr-2'>{t('translation:process')}</span>
                    <span>{processId}</span>
                </Row>
                <Card id='data-card'>

                    {/*
    content area with patient inputs and check box
    */}
                    <Card.Body id='data-header'>
                        <Row>
                            <Col sm='5'>
                                <Card.Title className='m-sm-0 jcc-xs-jcfs-sm' as={'h2'}>{t('translation:qr-code')}</Card.Title>
                                <hr />
                                <Card.Text className='input-label font-weight-bold mt-4 jcc-xs-jcfs-sm' >{t('translation:patient-data')}</Card.Text>
                                <Card.Text className='input-label jcc-xs-jcfs-sm mb-0' >{quickTest.personData.givenName + ' ' + quickTest.personData.familyName}</Card.Text>
                                <Moment className='input-label mb-3 jcc-xs-jcfs-sm' locale='de' format={utils.momentDateFormat} >{quickTest.personData.dateOfBirth as Date}</Moment>
                                <Card.Text className='input-label jcc-xs-jcfs-sm' >{quickTest.personData.sex === Sex.MALE ? t('translation:male') : quickTest.personData.sex === Sex.FEMALE ? t('translation:female') : t('translation:diverse')}</Card.Text>
                                <Card.Text className='input-label jcc-xs-jcfs-sm mb-0' >{quickTest.addressData.street}</Card.Text>
                                {/* <Card.Text className='input-label jcc-xs-jcfs-sm mb-0' >{quickTest?.addressData.street + ' ' + quickTest?.addressData.houseNumber}</Card.Text> */}
                                <Card.Text className='input-label jcc-xs-jcfs-sm' >{quickTest.addressData.zip + ' ' + quickTest.addressData.city}</Card.Text>
                                <Card.Text className='input-label jcc-xs-jcfs-sm mb-0' >{quickTest.phoneNumber}</Card.Text>
                                <Card.Text className='input-label jcc-xs-jcfs-sm' >{quickTest.emailAddress}</Card.Text>
                                <Card.Text className='input-label jcc-xs-jcfs-sm' >{quickTest.testId}</Card.Text>
                            </Col>
                            <Col sm='7' className='px-4'>
                                <Container id='qr-code-container'>
                                    {qrCodeValue ? <><QRCode id='qr-code' size={256} renderAs='svg' value={qrCodeValue[0]} />
                                    </> : <></>}
                                </Container>
                            </Col>
                        </Row>
                    </Card.Body>

                    {/*
    footer with correction and finish button
    */}
                    
                    <CardFooter
                        cancelText={t('translation:patient-data-correction')}
                        okText={t('translation:process-finish')}
                        handleCancel={navigation!.toRecordPatient}
                        handleOk={() => handlePost()}
                        disabled={postInProgress}
                    />

                </Card>
            </>

    )
}

export default ShowPatientData;