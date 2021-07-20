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
import { FormGroupConsentCkb, FormGroupInput } from './modules/form-group.component';
import { IUser } from '../misc/user';

const UserModal = (props: any) => {

    const [btnOkDisabled, setBtnOkDisabled] = React.useState(false);
    const { t } = useTranslation();

    const [user, setUser] = React.useState<IUser>(props.user);
    const [isNew, setIsNew] = React.useState(true);

    React.useEffect(() => {
        if (props.user.email !== user.email) {
            setUser(props.user);
            setIsNew(!!props.user.email);
        }
    },[props.user])

    const handleCancel = () => {
        props.onCancel();
        // props.onHide();
    }

    const updateUserProp = (name:string, value:any) => {
        const nuser = { ...user, [name]: value};
        setUser(nuser);
    }

    const handleOk = () => {
        setBtnOkDisabled(true);
        if (props.handleOk) {
            props.handleOk(user, setUser);
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
                    <Modal.Title>Benutzerdaten</Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-0 bg-light'>
                < FormGroupInput controlId='formEmailInput' title="Email"
                                    value={user.email}
                                    type='email'
                                    required
                                    readOnly={isNew}
                                    onChange={(evt: any) => updateUserProp('email',evt.target.value)}
                                    maxLength={255}
                                />
                < FormGroupInput controlId='formFirstName' title="Fist Name"
                                    value={user.firstName}
                                    required
                                    onChange={(evt: any) => updateUserProp('firstName',evt.target.value)}
                                    maxLength={255}
                                />
                < FormGroupInput controlId='formLastName' title="Last Name"
                                    value={user.lastName}
                                    onChange={(evt: any) => updateUserProp('lastName',evt.target.value)}
                                    required
                                    maxLength={255}
                                />
                < FormGroupInput controlId='formPassword' title="Password"
                                    value={user.password}
                                    onChange={(evt: any) => updateUserProp('password',evt.target.value)}
                                    required
                                    maxLength={255}
                                />
                <FormGroupConsentCkb controlId='formDccConsentCheckbox' title="Role Lab"
                    onChange={(evt: any) => updateUserProp('roleLab',evt.currentTarget.checked)}
                    type='checkbox'
                    checked={user.roleLab}
                />                                
                <FormGroupConsentCkb controlId='formDccConsentCheckbox' title="Role Counter"
                    onChange={(evt: any) => updateUserProp('roleCounter',evt.currentTarget.checked)}
                    type='checkbox'
                    checked={user.roleCounter}
                />
                <Form.Group as={Row} className='mb-1'>
                    <Form.Label className='input-label' column xs='5' sm='3'>Gruppe</Form.Label>
                    <Col xs='7' sm='9' className='d-flex'>
                    <Form.Control as="select"
                        className={!props.value ? 'selection-placeholder qt-input' : 'qt-input'}
                        value={user.group}
                        onChange={(ent: any) => updateUserProp('group',ent.target.value)}
                        required
                    >
                        {props.groups.map((g: string) => <option key={g} value={g}>{g}</option>)}
                    </Form.Control>
            </Col>
        </Form.Group>                                

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

export default UserModal;