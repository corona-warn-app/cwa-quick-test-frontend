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
import { Button, Col, Container, Modal, Row, Spinner, Form } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';
import { FormGroupTextarea, FormGroupInput } from './modules/form-group.component';
import { IGroup } from '../misc/user';

const GroupModal = (props: any) => {

    const [btnOkDisabled, setBtnOkDisabled] = React.useState(false);
    const { t } = useTranslation();

    const [group, setGroup] = React.useState<IGroup>(props.group);
    const [data, setData] = React.useState('');
    const [isNew, setIsNew] = React.useState(true);

    React.useEffect(() => {
        if (props.group.id !== group.id) {
            setGroup(props.group);
            setData(unpackData(props.group.data))
            setIsNew(!!props.group.id);
        }
    },[props.group])

    const handleCancel = () => {
        props.onCancel();
        // props.onHide();
    }

    const unpackData = (data:string) => {
        if (data) {
            data = data.replaceAll(',','\n')
        }
        return data;
    }

    const packData = (data:string) => {
        if (data) {
            data = data.replaceAll('\n',',')
        }
        return data;
    }

    const updateGroupProp = (name:string, value:any) => {
        const ngroup = { ...group, [name]: value};
        setGroup(ngroup);
    }

    const handleOk = () => {
        setBtnOkDisabled(true);
        if (props.handleOk) {
            group.data = packData(data);
            props.handleOk(group, setGroup);
        }
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
                    <Modal.Title>Gruppendaten</Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-0 bg-light'>
                < FormGroupInput controlId='formFirstName' title="Name"
                                    value={group.name}
                                    required
                                    onChange={(evt: any) => updateGroupProp('name',evt.target.value)}
                                    maxLength={255}
                                />
                < FormGroupTextarea controlId='formLastName' title="Data"
                                    value={data}
                                    onChange={(evt: any) => setData(evt.target.value)}
                                    type='textarea'
                                    required
                                    maxLength={255}
                                />
                </Modal.Body>
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
                                    disabled={btnOkDisabled}
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

export default GroupModal;