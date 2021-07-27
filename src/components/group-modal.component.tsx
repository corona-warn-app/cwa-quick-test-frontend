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
import { Button, Modal, Form, Col, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';
import { FormGroupTextarea, FormGroupInput } from './modules/form-group.component';
import { IGroupDetails, IGroupNode, IGroup } from '../misc/user';
import { useGetGroupDetails } from '../api';
import CwaSpinner from './spinner/spinner.component';

const emptyGroup: IGroupDetails = {
    id: '',
    pocId: '',
    name: '',
    pocDetails: '',
}

const GroupModal = (props: any) => {

    const [btnOkDisabled, setBtnOkDisabled] = React.useState(true);
    const { t } = useTranslation();

    const [data, setData] = React.useState('');
    const [validated, setValidated] = React.useState(false);

    const groupReloaded = (group: IGroupDetails) => {
        if (group) {
            setData(unpackData(group.pocDetails))
            group.parentGroup = props.parentGroupId;
        }
        setBtnOkDisabled(false);
    }

    const [group, updateGroup, setGroup] = useGetGroupDetails(groupReloaded, props.handleError);

    const handleCancel = () => {
        props.onCancel();
    }

    const unpackData = (data:string) => {
        if (data) {
            data = data.replaceAll(',','\n')
        } else {
            data = ''
        }
        return data;
    }

    const packData = (data:string) => {
        if (data) {
            data = data.replaceAll('\n',',')
        }
        return data;
    }

    const handleOk = () => {
        setBtnOkDisabled(true);
        if (props.handleOk) {
            group.pocDetails = packData(data);
            props.handleOk(group);
        }
    }

    const handleEnter = () => {
        setBtnOkDisabled(false);
        if (props.groupId) {
            updateGroup(props.groupId);
        } else {
            setGroup({...emptyGroup});
            setData('')
        }
    }

    const updateGroupProp = (name:string, value:any) => {
        const ngroup = { ...group, [name]: value};
        setGroup(ngroup);
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

    const isNew = !(group && group.id);

    const selfIdOrChildren: string[] = [];
    const collectChildren = (idlist: string[], parentNode: IGroup) => {
        if (parentNode) {
            idlist.push(parentNode.id);
            parentNode.children.forEach(child => collectChildren(idlist, child as IGroup));
        }
    }
    if (!isNew) {
        const node = props.groups.find((groupNode: IGroupNode) => groupNode.group.id === group.id);
        if (node) {
            collectChildren(selfIdOrChildren, node.group);
        }
    }
    const fList = props.groups.filter((groupNode: IGroupNode) => selfIdOrChildren.indexOf(groupNode.group.id)<0)
    const groupOptions = fList.map((groupNode: IGroupNode) => 
        <option key={groupNode.group.id} value={groupNode.group.id}>{"\u00A0\u00A0\u00A0\u00A0".repeat(groupNode.level)+groupNode.group.name}</option>
    );
    groupOptions.push(<option key="empty" value="empty">-- keine Elterngruppe --</option>);

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
                    <Modal.Title>{isNew ? 'Neue Gruppe anlegen' : 'Gruppe bearbeiten'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-0 bg-light'>
                {!isNew ?
                    <Form.Group as={Row} className='mb-1'>
                        <Form.Label className='input-label' column xs='5' sm='3'>Übergeordnete Gruppe</Form.Label>
                        <Col xs='7' sm='9' className='d-flex'>
                        <Form.Control as="select"
                            className={!props.value ? 'selection-placeholder qt-input' : 'qt-input'}
                            value={group.parentGroup ? group.parentGroup : 'empty'}
                            onChange={(ent: any) => updateGroupProp('parentGroup',ent.target.value)}
                        >
                            {groupOptions}
                        </Form.Control>
                        </Col>
                    </Form.Group> : null} 
                < FormGroupInput controlId='formFirstName' title="Name"
                                    value={group ? group.name : ''}
                                    required
                                    onChange={(evt: any) => updateGroupProp('name',evt.target.value)}
                                    maxLength={50}
                                />
                < FormGroupInput controlId='formFirstName' title="POC Id"
                                    value={group && group.pocId ? group.pocId : ''}
                                    onChange={(evt: any) => updateGroupProp('pocId',evt.target.value)}
                                    maxLength={50}
                                />
                < FormGroupTextarea controlId='formLastName' title="Data"
                                    value={data}
                                    onChange={(evt: any) => setData(evt.target.value)}
                                    type='textarea'
                                    maxLength={300}
                                />
                </Modal.Body>
                <Modal.Footer id='data-footer'>
                    {btnOkDisabled ? <CwaSpinner/> : null}
                    <Button onClick={handleCancel}>
                        {t('translation:cancel')}
                    </Button>
                    <Button type='submit' disabled={btnOkDisabled}> 
                        {isNew ? 'Erstellen' : 'Übernehmen'}
                    </Button>
                </Modal.Footer>
                </Form>
            </Modal>
    )
}

export default GroupModal;