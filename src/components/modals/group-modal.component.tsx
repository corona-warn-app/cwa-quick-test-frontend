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
import { Button, Modal, Form, Col, Row, Spinner, Fade, Container } from 'react-bootstrap'

import '../../i18n';
import { useTranslation } from 'react-i18next';
import { FormGroupTextarea, FormGroupInput, FormGroupSelect } from '../modules/form-group.component';
import { IGroupDetails, IGroupNode, IGroup } from '../../misc/user';
import { useGetGroupDetails } from '../../api';
import { v4 as newUuid } from 'uuid';
import CwaSpinner from '../spinner/spinner.component';

const emptyGroup: IGroupDetails = {
    id: '',
    pocId: '',
    name: '',
    pocDetails: '',
    parentGroup: ''
}

const GroupModal = (props: any) => {

    const [btnOkDisabled, setBtnOkDisabled] = React.useState(true);
    const { t } = useTranslation();

    const [data, setData] = React.useState('');
    const [validated, setValidated] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const [isNew, setIsNew] = React.useState(true);
    const [options, setOptions] = React.useState<JSX.Element[]>();

    const groupReloaded = (group: IGroupDetails) => {
        if (group) {
            setData(unpackData(group.pocDetails))
            group.parentGroup = props.parentGroupId;
        }
        setBtnOkDisabled(false);
    }

    const [group, updateGroup, setGroup] = useGetGroupDetails(groupReloaded, props.handleError);

    React.useEffect(() => {
        if (group) {
            setIsReady(true);
            const options = getOptions();
            setOptions(options);
        }

        setIsNew(!(group && group.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group])

    const handleCancel = () => {
        props.onCancel();
    }

    const unpackData = (data: string) => {
        if (data) {
            data = data.replaceAll(',', '\n')
        } else {
            data = ''
        }
        return data;
    }

    const packData = (data: string) => {
        if (data) {
            data = data.replaceAll('\n', ',')
        }
        return data;
    }

    const handleOk = () => {
        if (props.handleOk) {
            setBtnOkDisabled(true);
            group.pocDetails = packData(data);

            if (!group.pocId) {
                group.pocId = newUuid();
            }

            props.handleOk(group);
        }
    }

    const handleEnter = () => {
        setBtnOkDisabled(false);
        setValidated(false);

        if (props.groupId) {
            updateGroup(props.groupId);
        }
        else {
            setGroup({ ...emptyGroup });
            setData('')
        }
    }

    const handleExited = () => {
        setIsReady(false);
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

    const updateGroupProp = (name: string, value: any) => {
        const ngroup = { ...group, [name]: value };
        setGroup(ngroup);
    }

    const collectChildren = (idlist: string[], parentNode: IGroup) => {
        if (parentNode) {
            idlist.push(parentNode.id);
            parentNode.children.forEach(child => collectChildren(idlist, child as IGroup));
        }
    }

    const getOptions = () => {
        let result: JSX.Element[] = [];

        if (group && group.id) {
            
            const node = props.groups.find((groupNode: IGroupNode) => groupNode.group.id === group.id);
            const selfIdOrChildren: string[] = [];

            if (node) {
                collectChildren(selfIdOrChildren, node.group);
            }

            const fList = props.groups.filter((groupNode: IGroupNode) => selfIdOrChildren.indexOf(groupNode.group.id) < 0)

            result = fList.map((groupNode: IGroupNode) =>
                <option key={groupNode.group.id} value={groupNode.group.id}>{"\u00A0\u00A0\u00A0\u00A0".repeat(groupNode.level) + groupNode.group.name}</option>
            );

            // result.push(<option key="empty" value="empty">{t('translation:no-parentgroup-option')}</option>);
        }


        return result;
    }



    return (
        <Modal
            contentClassName='data-modal'
            size="lg"
            show={props.show}
            backdrop="static"
            keyboard={false}
            centered
            onEnter={handleEnter}
            onExited={handleExited}
        >
            {!isReady
                ? <CwaSpinner background='#eeeeee' />
                : <Fade appear={true} in={true} >
                    <Form
                        className='form-flex'
                        onSubmit={handleSubmit}
                        validated={validated}
                    >
                        <Modal.Header id='data-header' className='pb-0' >
                            <Modal.Title>{isNew ? t('translation:add-group') : t('translation:edit-group')}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className='bg-light'>
                            {isNew
                                ? <></>
                                : <>
                                    <FormGroupSelect controlId='formGroupSelect'
                                        title={t('translation:parentgroup')}
                                        placeholder={t('translation:no-parentgroup-option')}
                                        value={group.parentGroup}
                                        onChange={(ent: any) => updateGroupProp('parentGroup', ent.target.value)}
                                        options={options}
                                    />

                                    <hr />
                                </>
                            }

                            < FormGroupInput controlId='formFirstName' title={t('translation:name')}
                                value={group ? group.name : ''}
                                required
                                onChange={(evt: any) => updateGroupProp('name', evt.target.value)}
                                maxLength={50}
                            />

                            < FormGroupTextarea controlId='formAdressData' title={t('translation:address-doctor')} placeholder={t('translation:address-doctor-placeholder')}
                                value={data}
                                onChange={(evt: any) => setData(evt.target.value)}
                                type='textarea'
                                maxLength={300}
                            />

                            {!(group && group.pocId)
                                ? <></>
                                : <>
                                    <hr />
                                    < FormGroupInput controlId='formPocId' title={t('translation:poc-id')}
                                        value={group && group.pocId ? group.pocId : ''}
                                        readOnly
                                    />
                                </>
                            }

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
                </Fade>
            }
        </Modal>
    )
}

export default GroupModal;