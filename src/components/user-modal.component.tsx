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
import { Button, Col, Modal, Row, Form } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';
import { FormGroupConsentCkb, FormGroupInput } from './modules/form-group.component';
import { IUser, IGroupNode } from '../misc/user';

const UserModal = (props: any) => {

    const { t } = useTranslation();

    const [user, setUser] = React.useState<IUser>(props.user);
    const [isNew, setIsNew] = React.useState(true);
    const [validated, setValidated] = React.useState(false);

    React.useEffect(() => {
        if (props.user.username !== user.username) {
            if (!props.user.username 
                && !props.user.subGroup
                && props.groups
                && props.groups.length>0) {
                // props.user.subGroup = props.groups[0].group.id;
            }
            setUser(props.user);
            setIsNew(!props.user.username);
        }
    },[props.user, user.username, props.groups]);

    const handleCancel = () => {
        props.onCancel();
        // props.onHide();
    }

    const updateUserProp = (name:string, value:any) => {
        const nuser = { ...user, [name]: value};
        setUser(nuser);
    }

    const handleOk = () => {
        if (props.handleOk) {
            props.handleOk(user, setUser);
        }
    }

    const handleEnter = () => {
        setValidated(false);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity()) {
            handleOk();
        }
    }

    const groupOptions = props.groups.map((groupNode: IGroupNode) => 
        <option key={groupNode.group.id} value={groupNode.group.id}>{"\u00A0\u00A0\u00A0\u00A0".repeat(groupNode.level)+groupNode.group.name}</option>
    );

    if (!user.subGroup || !props.groups.find((groupNode: IGroupNode) => groupNode.group.id === user.subGroup)) {
        user.subGroup = null;
        groupOptions.push(<option key="empty" value="empty">-- leer --</option>);
    }

    return (
            <Modal
                contentClassName='data-modal'
                show={props.show}
                backdrop="static"
                keyboard={false}
                centered
                onEnter={handleEnter}
            >
                <Form className='form-flex' onSubmit={handleSubmit} validated={validated}>
                <Modal.Header id='data-header' className='pb-0' >
                    <Modal.Title>{isNew ? 'Neuen Benutzer anlegen' : 'Benutzer bearbeiten'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-0 bg-light'>
                < FormGroupInput controlId='formEmailInput' title="Benutzername"
                                    value={user.username}
                                    required
                                    readOnly={!isNew}
                                    onChange={(evt: any) => updateUserProp('username',evt.target.value)}
                                    minLength={3}
                                    maxLength={50}
                                />
                < FormGroupInput controlId='formFirstName' title="Vorname"
                                    value={user.firstName}
                                    required
                                    onChange={(evt: any) => updateUserProp('firstName',evt.target.value)}
                                    maxLength={30}
                                />
                < FormGroupInput controlId='formLastName' title="Nachname"
                                    value={user.lastName}
                                    onChange={(evt: any) => updateUserProp('lastName',evt.target.value)}
                                    required
                                    maxLength={30}
                                />
                < FormGroupInput controlId='formPassword' title="Passwort"
                                    value={user.password}
                                    onChange={(evt: any) => updateUserProp('password',evt.target.value)}
                                    required={isNew}
                                    type='password'
                                    minLength={8}
                                    maxLength={64}
                                />
                <FormGroupConsentCkb controlId='formRoleLab' title="Role Lab"
                    onChange={(evt: any) => updateUserProp('roleLab',evt.currentTarget.checked)}
                    type='checkbox'
                    checked={user.roleLab}
                />                                
                <FormGroupConsentCkb controlId='formRoleCounter' title="Role Counter"
                    onChange={(evt: any) => updateUserProp('roleCounter',evt.currentTarget.checked)}
                    type='checkbox'
                    checked={user.roleCounter}
                />
                <Form.Group as={Row} className='mb-1'>
                    <Form.Label className='input-label' column xs='5' sm='3'>Gruppe</Form.Label>
                    <Col xs='7' sm='9' className='d-flex'>
                    <Form.Control as="select"
                        className={!props.value ? 'selection-placeholder qt-input' : 'qt-input'}
                        value={user.subGroup ? user.subGroup: 'empty'}
                        onChange={(ent: any) => updateUserProp('subGroup',ent.target.value)}
                    >
                        {groupOptions}
                    </Form.Control>
                    </Col>
                </Form.Group>                                
                </Modal.Body>
                <Modal.Footer id='data-footer'>
                                <Button onClick={handleCancel}>
                                    {t('translation:cancel')}
                                </Button>
                                <Button type='submit'>
                                    {isNew ? 'Erstellen' : 'Übernehmen'}
                                </Button>
                </Modal.Footer>
                </Form>
            </Modal>
    )
}

export default UserModal;