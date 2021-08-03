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
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'

import '../../i18n';
import { useTranslation } from 'react-i18next';

const ConfirmModal = (props: any) => {
    const { t } = useTranslation();

    return (
        <Modal
            contentClassName='data-modal'
            show={props.show}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header id='data-header' className='pb-0' >
            </Modal.Header>
            <Modal.Body className='py-0 bg-light'>
            {props.message}
            </Modal.Body>
            <Modal.Footer id='data-footer'>
                <Container className='p-0'>
                    <Row>
                        <Col xs='6' md='4' className='pl-0'>
                            <Button
                                className='py-0'
                                block
                                variant='outline-primary'
                                onClick={props.onCancel}
                            >
                                {t('translation:cancel')}
                            </Button>
                        </Col>
                        <Col xs='6' md='4' className='pr-0'>
                            <Button
                                className='py-0'
                                block
                                onClick={props.handleOk}
                            >
                                {t('translation:ok')}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModal;