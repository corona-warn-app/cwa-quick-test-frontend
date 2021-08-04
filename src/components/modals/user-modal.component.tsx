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
import { Button, Col, Modal, Row, Form, Spinner, Container } from 'react-bootstrap'

import '../../i18n';
import { useTranslation } from 'react-i18next';
import { FormGroupInput, FormGroupPermissionCkb, FormGroupSelect } from '../modules/form-group.component';
import { IUser, IGroupNode } from '../../misc/user';

const UserModal = (props: any) => {

    const { t } = useTranslation();

    const [user, setUser] = React.useState<IUser>(props.user);
    const [isNew, setIsNew] = React.useState(true);
    const [validated, setValidated] = React.useState(false);
    const [btnOkDisabled, setBtnOkDisabled] = React.useState(true);
    const [options, setOptions] = React.useState<JSX.Element[]>();

    React.useEffect(() => {
        if (props.user.username !== user.username || !props.user.username) {
            setUser(props.user);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user]);

    React.useEffect(() => {
        const options = getOptions();
        setOptions(options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleCancel = () => {
        props.onCancel();
    }

    const updateUserProp = (name: string, value: any) => {
        const nuser = { ...user, [name]: value };
        setUser(nuser);
    }

    const handleOk = () => {
        if (props.handleOk) {
            setBtnOkDisabled(true);
            props.handleOk(user, setUser);
        }
    }

    const handleEnter = () => {
        setIsNew(!props.user.username);
        setBtnOkDisabled(false);
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

    const getOptions = () => {
        let result: JSX.Element[] = [];

        result = props.groups.map((groupNode: IGroupNode) =>
            <option key={groupNode.group.id} value={groupNode.group.id}>{"\u00A0\u00A0\u00A0\u00A0".repeat(groupNode.level) + groupNode.group.name}</option>
        )

        if (!user.subGroup || !props.groups.find((groupNode: IGroupNode) => groupNode.group.id === user.subGroup)) {
            user.subGroup = null;
            result.unshift(<option key={0} value='empty'>{t('translation:no-group-option')}</option>);
        }

        return result;
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
                    <Modal.Title>{isNew ? t('translation:add-user') : t('translation:edit-user')}</Modal.Title>
                </Modal.Header>

                <Modal.Body className='bg-light'>
                    < FormGroupInput controlId='formEmailInput' title={t('translation:user-name')}
                        value={user.username}
                        required
                        readOnly={!isNew}
                        onChange={(evt: any) => updateUserProp('username', evt.target.value)}
                        minLength={3}
                        maxLength={50}
                    />

                    < FormGroupInput controlId='formFirstName' title={t('translation:first-name')}
                        value={user.firstName}
                        required
                        onChange={(evt: any) => updateUserProp('firstName', evt.target.value)}
                        maxLength={30}
                    />

                    < FormGroupInput controlId='formLastName' title={t('translation:name')}
                        value={user.lastName}
                        onChange={(evt: any) => updateUserProp('lastName', evt.target.value)}
                        required
                        maxLength={30}
                    />

                    < FormGroupInput controlId='formPassword' title={t('translation:password')}
                        value={user.password}
                        onChange={(evt: any) => updateUserProp('password', evt.target.value)}
                        required={isNew}
                        type='password'
                        minLength={8}
                        maxLength={64}
                    />

                    <hr />

                    <FormGroupPermissionCkb controlId='formRoleLab' title={t('translation:permission')} label={t('translation:for-lab')}
                        onChange={(evt: any) => updateUserProp('roleLab', evt.currentTarget.checked)}
                        type='checkbox'
                        checked={user.roleLab}
                    />

                    <FormGroupPermissionCkb controlId='formRoleCounter' title={t('translation:permission')} label={t('translation:for-counter')}
                        onChange={(evt: any) => updateUserProp('roleCounter', evt.currentTarget.checked)}
                        type='checkbox'
                        checked={user.roleCounter}
                    />

                    <hr />

                    <FormGroupSelect controlId='formGroupSelect'
                        title={t('translation:group')}
                        value={user.subGroup ? user.subGroup : 'empty'}
                        onChange={(ent: any) => updateUserProp('subGroup', ent.target.value)}
                        options={options}
                        required
                    />

                </Modal.Body>
                <Modal.Footer id='data-footer'>
                    <Container className='p-0'>
                        <Row>
                            <Col sm='6' lg='4' className='mb-2 mb-sm-0 p-0 pr-sm-2'>
                                <Button
                                    className='p-0'
                                    block
                                    variant='outline-primary'
                                    onClick={handleCancel}
                                >
                                    {t('translation:cancel')}
                                </Button>
                            </Col>
                            <Col sm='6' lg='4' className='p-0 pl-sm-2'>
                                <Button
                                    className='p-0'
                                    block
                                    type='submit'
                                    disabled={btnOkDisabled}
                                >
                                    {isNew ? t('translation:add') : t('translation:edit')}

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
            </Form>
        </Modal>
    )
}

export default UserModal;