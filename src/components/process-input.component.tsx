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
import { Button, Card, Col, Container, Modal, Row, Spinner } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';
import { FormGroupInput } from './modules/form-group.component';
import utils from '../misc/utils';
import { IShortHashedGuid, useGetPendingProcessIds } from '../api';

const ProcessIdInput = (props: any) => {

    const { t } = useTranslation();
    const [processNo, setProcessNo] = React.useState('');
    const [btnOkDisabled, setBtnOkDisabled] = React.useState(false);
    const processIds = useGetPendingProcessIds();

    const handleCancel = () => {
        props.onCancel();
        // props.onHide();
    }

    const handleOk = () => {
        setBtnOkDisabled(true);
        props.onChange(processNo);
        // props.onHide();
    }

    const handleEnter = () => {
        setBtnOkDisabled(false);
    }

    return (
        <>
            <Modal
                contentClassName='data-modal'
                show={props.show}
                backdrop="static"
                keyboard={false}
                centered
                onEnter={handleEnter}
            >
                <Modal.Header id='data-header' className='pb-0' >
                    <Row>
                        <Col >
                            <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:testId-input-header')}</Card.Title>
                        </Col>
                    </Row>
                </Modal.Header>

                {/*
    content area with process number input and radios
    */}
                <Modal.Body className='py-0 bg-light'>
                    <hr />

                    < FormGroupInput controlId='formProcessModalInput' title={t('translation:process-number')}
                        value={processNo}
                        onChange={(evt: any) => setProcessNo(evt.currentTarget.value)}
                        required
                        min={utils.shortHashLen}
                        maxLength={utils.shortHashLen}
                        pattern={utils.pattern.processNo}
                        datalistId='processId-list'
                        datalist={processIds ? processIds.map((i: IShortHashedGuid) => <option key={i.shortHashedGuid} value={i.shortHashedGuid} />) : undefined}
                    />

                    <hr />
                </Modal.Body>

                {/*
    footer with cancel and submit button
    */}
                <Modal.Footer id='data-footer'>
                    <Container className='p-0'>
                        <Row>
                            <Col xs='6' md='4' className='pl-0'>
                                <Button
                                    className='py-0'
                                    block
                                    variant='outline-primary'
                                    onClick={handleCancel}
                                >
                                    {t('translation:cancel')}
                                </Button>
                            </Col>
                            <Col xs='6' md='4' className='pr-0'>
                                <Button
                                    className='py-0'
                                    block
                                    onClick={handleOk}
                                    disabled={processNo.length !== utils.shortHashLen || btnOkDisabled}
                                >
                                    {t('translation:ok')}

                                    <Spinner
                                        as="span"
                                        className='btn-spinner'
                                        animation="border"
                                        hidden={!btnOkDisabled}
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ProcessIdInput;