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
    const [validated, setValidated] = React.useState(false);

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity()) {
            handleOk();
        }
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
                    <Button onClick={handleCancel}>
                        {t('translation:cancel')}
                    </Button>
                    <Button type='submit'>
                        {t('translation:ok')}
                    </Button>
                </Modal.Footer>
                </Form>
            </Modal>
    )
}

export default GroupModal;