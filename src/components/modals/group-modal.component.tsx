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
import { Button, Modal, Form, Col, Row, Spinner, Fade, Container, Collapse, Dropdown, FormControl } from 'react-bootstrap'

import '../../i18n';
import { useTranslation } from 'react-i18next';
import { FormGroupTextarea, FormGroupInput, FormGroupSelect, FormGroupPermissionCkb } from '../modules/form-group.component';
import { IGroupDetails, IGroupNode, IGroup } from '../../misc/user';
import { useGetGroupDetails } from '../../api';
import CwaSpinner from '../spinner/spinner.component';
import utils from '../../misc/utils';

const emptyGroup: IGroupDetails = {
    id: '',
    // bsnr: '',
    pocId: '',
    name: '',
    pocDetails: '',
    searchPortalConsent: true,
    parentGroup: '',
    website: '',
    email: '',
    appointmentRequired: false,
    openingHours: []
}

const GroupModal = (props: any) => {

    const [btnOkDisabled, setBtnOkDisabled] = React.useState(true);
    const { t } = useTranslation();

    const [data, setData] = React.useState('');
    const [validated, setValidated] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const [isNew, setIsNew] = React.useState(true);
    const [options, setOptions] = React.useState<JSX.Element[]>();
    const [dropdownItems, setDropdownItems] = React.useState<JSX.Element[]>();
    const [dropdownList] = React.useState<string[]>(['https://', 'http://']);
    const [selectedDropdownValue, setSelectedDropdownValue] = React.useState<string>(dropdownList[0]);
    const [websiteValue, setWebsiteValue] = React.useState('');
    const [displayOpeningHours, setDisplayOpeningHours] = React.useState('');
    const [errorOpeningHour, setErrorOpeningHour] = React.useState<string>('');

    const groupReloaded = (group: IGroupDetails) => {
        if (group) {
            setData(unpackData(group.pocDetails))
            group.parentGroup = props.parentGroupId;

            if (group.website) {
                let website = '';

                for (const item of dropdownList) {
                    if (group.website.startsWith(item)) {
                        website = group.website.slice(item.length, group.website.length);
                        setSelectedDropdownValue(item);
                    }
                }

                setWebsiteValue(website);
            }
            else {
                setWebsiteValue('');
                setSelectedDropdownValue(dropdownList[0]);
            }
        }
        setBtnOkDisabled(false);
    }

    const [group, updateGroup, setGroup] = useGetGroupDetails(groupReloaded, props.handleError);


    React.useEffect(() => {
        getDropdownItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (group) {
            setIsReady(true);
            const options = getOptions();
            setOptions(options);
            setDisplayOpeningHours(
                group.openingHours?.map(
                    (element: string) => element)
                    .join('\n'));
        }

        setIsNew(!(group && group.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group])

    React.useEffect(() => {
        setValidated(props.isSuccess)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isSuccess]);

    React.useEffect(() => {
        if (props.isCreationError) {
            setBtnOkDisabled(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isCreationError]);

    const handleCancel = () => {
        setErrorOpeningHour('');
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
            if (websiteValue
                && (
                    websiteValue.startsWith('www.')
                    || !(
                        websiteValue.startsWith(dropdownList[0])
                        || websiteValue.startsWith(dropdownList[1])
                    )
                )) {
                group.website = selectedDropdownValue + websiteValue;
            }
            else {
                group.website = websiteValue;
            }

            props.handleOk(group);
        }
    }

    const handleEnter = () => {
        if (props.onEnter) {
            props.onEnter();
        }

        setBtnOkDisabled(false);

        if (props.groupId) {
            updateGroup(props.groupId);
        }
        else {
            setGroup({ ...emptyGroup });
            setSelectedDropdownValue(dropdownList[0]);
            setData('');
            setWebsiteValue('');
        }
    }

    const handleExited = () => {
        setIsReady(false);
        props.onExit();
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (errorOpeningHour) {
            document.getElementById('formPocOpeningHours')?.focus();
            return;
        }

        if (form.checkValidity()) {
            handleOk();
        }
    }

    const updateGroupProp = (name: string, value: any) => {
        const ngroup = { ...group, [name]: value };
        setGroup({ ...ngroup });
    }

    const changeOpeningHoursHandler = (name: string, value: string) => {

        setDisplayOpeningHours(value);

        let error = undefined;
        const openingHours = value.split('\n');
        if (openingHours.length > 7) {
            setErrorOpeningHour('opening-hours-to-much-lines-error');
            return;
        }

        error = openingHours.find(element => {
            return !utils.isOpeningHoursValid(element);
        });

        if (error) {
            setErrorOpeningHour('openening-hours-to-long-error');
        } else {
            setErrorOpeningHour('');
            updateGroupProp("openingHours", openingHours);
        }
    }

    const updateSearchPortalConsent = (name: string, value: any) => {
        const ngroup: IGroupDetails = { ...group, [name]: value };

        if (value === false) {
            ngroup.email = '';
            ngroup.website = '';
            ngroup.openingHours = [];
            ngroup.appointmentRequired = false;
        }
        setGroup(ngroup);
    }

    const collectChildren = (idlist: string[], parentNode: IGroup) => {
        if (parentNode) {
            idlist.push(parentNode.id);
            parentNode.children.forEach(child => collectChildren(idlist, child as IGroup));
        }
    }

    const getOptions = (): JSX.Element[] => {
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

    const getDropdownItems = () => {
        setDropdownItems(
            dropdownList.map(
                (item: string) =>
                    <Dropdown.Item
                        onSelect={(eventKey: any) => setSelectedDropdownValue(eventKey)}
                        eventKey={item}
                        key={item}
                    >
                        {item}
                    </Dropdown.Item>));
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
                                onChange={(evt: any) => {
                                    updateGroupProp('name', evt.target.value);
                                    props.resetError();
                                }}
                                maxLength={45}
                                isInvalid={props.isCreationError}
                                InvalidText={t('translation:group-conflict-error')}
                            />

                            {/* <hr /> */}

                            < FormGroupTextarea controlId='formAdressData' title={t('translation:address-testcenter')} placeholder={t('translation:address-testcenter-placeholder')}
                                value={data}
                                required
                                onChange={(evt: any) => setData(evt.target.value)}
                                type='textarea'
                                maxLength={300}
                            />

                            {/* < FormGroupInput controlId='formBSNRInput' title={t('translation:bsnr')} placeholder={t('translation:bsnr-placeholder')}
                                value={group ? group.bsnr : ''}
                                onChange={(evt: any) => {
                                    updateGroupProp('bsnr', evt.target.value);
                                    props.resetError();
                                }}
                                maxLength={9}
                                prepend='i'
                                tooltip={t('translation:bsnr-tooltip')}
                                pattern={utils.pattern.BSNR}
                            /> */}

                            <FormGroupPermissionCkb controlId='formRoleCounter' title={t('translation:searchPortalConsent')}
                                //label={t('translation:for-counter')}
                                onChange={(evt: any) => updateSearchPortalConsent('searchPortalConsent', evt.currentTarget.checked)}
                                type='checkbox'
                                checked={group.searchPortalConsent}
                            />

                            <Collapse in={group.searchPortalConsent}>
                                <div>
                                    < FormGroupInput controlId='formEmailInput' title={t('translation:email-address')}
                                        value={group?.email ? group.email : ''}
                                        onChange={(evt: any) => {
                                            updateGroupProp('email', evt.target.value);
                                            props.resetError();
                                        }}
                                        type='email'
                                        pattern={utils.pattern.eMail}
                                        minLength={5}
                                        maxLength={255}
                                    />
                                    < FormGroupInput controlId='formPocWebsite' title={t('translation:searchPortalWebsite')} placeholder={t('translation:searchPortalWebsitePlaceholder')}
                                        value={websiteValue}
                                        dropdown={dropdownItems}
                                        dropdownTitle={selectedDropdownValue}
                                        prepend='i'
                                        tooltip={t('translation:searchPortalWebsiteTooltip')}
                                        onChange={(evt: any) => {
                                            setWebsiteValue(evt.target.value);
                                            props.resetError();
                                        }}
                                        maxLength={100}
                                        pattern={utils.pattern.url}
                                    />

                                    < FormGroupTextarea controlId='formPocOpeningHours' title={t('translation:searchPortalOpeningHours')} placeholder={t('translation:address-testcenter-placeholder')}
                                        value={displayOpeningHours}
                                        onChange={(evt: any) => {
                                            changeOpeningHoursHandler('openingHours', evt.target.value);
                                            props.resetError();
                                        }}
                                        type='textarea'
                                        rows={7}
                                        pattern={utils.pattern.email}
                                        isInvalid={errorOpeningHour}
                                        invalidText={errorOpeningHour && t('translation:' + errorOpeningHour)}
                                    />
                                    <FormGroupPermissionCkb controlId='formAppointmentRequired' title={t('translation:searchPortalAppointmentRequired')}
                                        onChange={(evt: any) => updateGroupProp('appointmentRequired', evt.currentTarget.checked)}
                                        type='checkbox'
                                        checked={group?.appointmentRequired ? group.appointmentRequired : false}
                                    />
                                </div>
                            </Collapse>

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
