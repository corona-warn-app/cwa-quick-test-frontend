/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2022, T-Systems International GmbH
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
import { Button, Card, Col, Fade, Row } from 'react-bootstrap'
import QrReader from 'react-qr-reader'

import '../i18n';
import { useTranslation } from 'react-i18next';

import { getPersonDataFromScan } from '../misc/qr-code-value';
import CwaSpinner from './spinner/spinner.component';
import CardHeader from './modules/card-header.component';
import AppContext from '../misc/appContext';


const QrScan = (props: any) => {

    const context = React.useContext(AppContext);
    const { t } = useTranslation();

    const [message, setMessage] = React.useState('');
    const [isInit, setIsInit] = React.useState(false)

    React.useEffect(() => {
        if (context.navigation && context.valueSets)
            setIsInit(true);
    }, [context.navigation, context.valueSets])

    const handleScan = (data: string | null) => {
        if (props.setQuickTest && data) {
            try {
                const scannedPatient = getPersonDataFromScan(data);
                props.setQuickTest(scannedPatient);
                context.navigation!.toRecordPatient();

            } catch (e) {
                setMessage(t('translation:qr-code-no-patient-data'));
            }
        }
    }

    const handleError = (error: any) => {
        if (window.location.protocol === 'http:') {
            setMessage(t('translation:qr-scan-https-only'));
        } else {
            setMessage("Scan Error: " + error);
        }
    }

    var messageHtml = undefined;
    if (message.length > 0) {
        messageHtml = <div className="alert alert-warning">
            {message}
        </div>;
    }

    return (
        !(isInit && context && context.valueSets)
            ? <CwaSpinner />
            : <Fade appear={true} in={true} >
                <Card id='data-card'>
                    <CardHeader title={t('translation:qr-scan')} />

                    {/*
    content area with process number input and radios
    */}
                    <Card.Body id='data-body' className='pt-0'>
                        <QrReader
                            delay={300}
                            onScan={handleScan}
                            onError={handleError}
                        />
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
                                    onClick={context.navigation!.toLanding}
                                >
                                    {t('translation:cancel')}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Fade>
    )
}

export default QrScan;