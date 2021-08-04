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
import { Card, Fade, Table, Button, Row, Col } from 'react-bootstrap';
import CwaSpinner from './spinner/spinner.component';
import CardHeader from './modules/card-header.component';
import { useTranslation } from 'react-i18next';
import UserModal from './modals/user-modal.component';
import GroupModal from './modals/group-modal.component';
import ConfirmModal from './modals/confirm-modal.component';

import AppContext from '../misc/appContext';
import { IUser, IGroup, IGroupDetails, IGroupNode } from '../misc/user';
import { useGetUsers, useGetGroups, createUser, createGroup, deleteUser, deleteGroup, updateGroup, addUserToGroup, updateUser, addGroupAsChild } from '../api';
import { useKeycloak } from '@react-keycloak/web';

import imageAdd from '../assets/images/icon_add.svg'
import utils from '../misc/utils';

const emptyUser: IUser = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    subGroup: 'empty',
    roleLab: false,
    roleCounter: false,
}

const UserManagement = (props: any) => {
    const context = React.useContext(AppContext);
    const { t } = useTranslation();


    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        props.setError({ error: error, message: msg, onCancel: context.navigation!.toLanding });
    }

    const { keycloak } = useKeycloak();
    const [bUsers, refreshUsers] = useGetUsers(handleError);
    const [bGroups, refreshGroups] = useGetGroups(handleError);
    const [users, setUsers] = React.useState<IUser[]>([]);
    const [groups, setGroups] = React.useState<IGroup[]>([]);
    const [isInit, setIsInit] = React.useState(true);
    const [isUserData, setIsUserData] = React.useState(false);
    const [editUser, setEditUser] = React.useState<IUser>(emptyUser);
    const [isGroupEdit, setIsGroupEdit] = React.useState(false);
    const [editGroupId, setEditGroupId] = React.useState<string>('');
    const [editGroupParentId, setEditGroupParentId] = React.useState<string>('');

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [confirmMessage, setConfirmMessage] = React.useState('');
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmHandle, setConfirmHandle] = React.useState<() => void>();

    React.useEffect(() => {
        if (bUsers) {
            setUsers(bUsers);
        }
    }, [bUsers]);

    React.useEffect(() => {
        if (bGroups) {
            setGroups(bGroups);
        }
    }, [bGroups]);

    React.useEffect(() => {
        setIsInit(!!(bGroups && bUsers));
    }, [bUsers, bGroups]);


    const userUpdate = (user: IUser) => {
        if (editUser && editUser.username && keycloak.token) {
            const fuser = users.find(u => u.username === user.username);

            if (!user.password) {
                user.password = undefined;
            }

            updateUser(user, keycloak.token)
                .then(() => {
                    if (fuser && fuser.subGroup !== user.subGroup
                        && keycloak.token && user.subGroup && user.subGroup !== 'empty') {
                        addUserToGroup(user.id, user.subGroup, keycloak.token)
                            .then(() => {
                                refreshUsers();
                            })
                            .catch(e => {
                                handleError(e);
                            });
                    } else {
                        refreshUsers();
                    }
                })
                .finally(() => setIsUserData(false));

        } else {
            const newUser: any = { ...user };

            if (newUser.subGroup) {
                // The attribute has different name in backend for create
                newUser.subgroup = newUser.subGroup;
                delete newUser.subGroup;
            }

            if (keycloak.token) {
                createUser(newUser, keycloak.token).then(() => {
                    refreshUsers();
                })
                    .catch(e => {
                        handleError(e);
                    })
                    .finally(() => setIsUserData(false));;
            }
        }
    }

    const flattenGroups = (groups: IGroup[], groupNodes: IGroupNode[], level: number, parentGroup?: string): void => {
        groups.forEach((group: IGroup) => {

            const gNode: IGroupNode = {
                group: group,
                parentGroup: parentGroup,
                level: level,
            };

            groupNodes.push(gNode);

            if (group.children) {
                flattenGroups(group.children, groupNodes, level + 1, group.id);
            }
        });
    }

    const groupNodes: IGroupNode[] = [];
    flattenGroups(groups, groupNodes, 0);

    const groupUpdate = (group: IGroupDetails) => {
        if (group.id) {

            if (keycloak.token) {

                const uGroup: any = { ...group };
                delete uGroup.parentGroup;

                updateGroup(uGroup, keycloak.token)
                    .then(() => {
                        console.log("update group finished");
                        const fgroupNode = groupNodes.find((groupNode: IGroupNode) => groupNode.group.id === group.id);

                        if (keycloak.token
                            && fgroupNode
                            && group.id
                            && group.parentGroup
                            && group.parentGroup !== 'empty'
                            && fgroupNode.parentGroup !== group.parentGroup) {
                            addGroupAsChild(group.id, group.parentGroup, keycloak.token)
                                .then(() => {
                                    refreshGroups();
                                })
                                .catch(e => {
                                    handleError(e);
                                });
                        } else {
                            refreshGroups();
                        }
                    })
                    .catch(e => {
                        handleError(e);
                    })
                    .finally(() => setIsGroupEdit(false));
            }
        } else {
            if (keycloak.token) {
                createGroup(group, keycloak.token)
                    .then(() => {
                        refreshGroups();
                    })
                    .catch(e => {
                        handleError(e);
                    })
                    .finally(() => setIsGroupEdit(false));
            }
        }

        // setIsGroupEdit(false);
    }

    const startEditGroup = (groupNode: IGroupNode) => {
        setEditGroupId(groupNode.group.id);
        setEditGroupParentId(groupNode.parentGroup ? groupNode.parentGroup : '');
        setIsGroupEdit(true);
    }

    const handleDeleteGroup = (group: IGroup) => {
        setConfirmTitle(t('translation:delete-group-title', { groupName: group.name }));
        setConfirmMessage(t('translation:delete-group-msg'));
        setShowConfirm(true);

        const handle = () => {
            if (keycloak.token && group.id) {
                deleteGroup(group.id, keycloak.token)
                    .then(() => {
                        refreshGroups();
                    })
                    .catch(e => {
                        handleError(e);
                    })
                    .finally(() => setShowConfirm(false));
            }
        };
        // need to wrap a function again because react apply each function passed to hook
        setConfirmHandle(() => handle);
    }

    const startEditUser = (user: IUser) => {
        setEditUser({ ...user });
        setIsUserData(true);
    }

    const handleDeleteUser = (user: IUser) => {
        setConfirmTitle(t('translation:delete-user-title', { userName: user.username }));
        setConfirmMessage('');
        setShowConfirm(true);

        const handle = () => {
            if (keycloak.token && user.username) {
                deleteUser(user.id, keycloak.token)
                    .then(() => {
                        refreshUsers();
                    })
                    .catch(e => {
                        handleError(e);
                    })
                    .finally(() => setShowConfirm(false));
            }
        };
        // need to wrap a function again because react apply each function passed to hook
        setConfirmHandle(() => handle);
    }

    const rolesAsString = (user: IUser) => {
        let roleString = '';

        if (user.roleLab) {
            roleString = 'lab'
        }

        if (user.roleCounter) {
            if (roleString) {
                roleString += ' ';
            }
            roleString += 'counter';
        }

        return roleString;
    }

    const groupName = (groupId: string | null): string => {
        let groupName = ''

        if (groupId) {
            const fNode = groupNodes.find(gnode => gnode.group.id === groupId);

            if (fNode) {
                groupName = fNode.group.path;
            }
        }

        return groupName;
    }

    return (!(isInit && context && context.valueSets)
        ? <CwaSpinner />
        : <>
            <Fade appear={true} in={true} >
                <Card id='data-card'>

                    <CardHeader title={t('translation:user-management')} />

                    <Card.Body id='data-body' className='pt-0' >

                        <h4>{t('translation:groups')}</h4>

                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>{t('translation:name')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>{
                                groupNodes.map((g, i) =>
                                    <tr key={i}>
                                        <td width="90%">{utils.getIndent(g.level)}{g.group.name}</td>
                                        <td className='td-btn'>
                                            <Row className='m-0 justify-content-around'>
                                                <Button
                                                    className="btn-icon edit-icon"
                                                    onClick={() => startEditGroup(g)}
                                                >
                                                </Button>
                                                <Button className="btn-icon delete-icon"
                                                    onClick={() => handleDeleteGroup(g.group)}
                                                />
                                            </Row>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>

                        <Button
                            className='btn-add'
                            size="sm"
                            variant="light"
                            onClick={() => { setEditGroupId(''); setIsGroupEdit(true) }}
                        >
                            <img className='mr-2' src={imageAdd} alt="Hinzufügen" />
                            {t('translation:add-group')}
                        </Button>

                        <hr />

                        <h4>{t('translation:user')}</h4>

                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>{t('translation:user-name')}</th>
                                    <th>{t('translation:first-name')}</th>
                                    <th>{t('translation:name')}</th>
                                    <th>{t('translation:group')}</th>
                                    <th>{t('translation:roles')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>{
                                users.map((u, i) =>
                                    <tr key={i}>
                                        <td>{u.username}</td>
                                        <td>{u.firstName}</td>
                                        <td>{u.lastName}</td>
                                        <td>{groupName(u.subGroup)}</td>
                                        <td>{rolesAsString(u)}</td>
                                        <td className='td-btn'>
                                            <Row className='m-0 justify-content-around'>
                                                <Button
                                                    className="btn-icon edit-icon"
                                                    onClick={() => startEditUser({ ...u })}
                                                >
                                                </Button>
                                                <Button className="btn-icon delete-icon"
                                                    onClick={() => handleDeleteUser(u)}
                                                />
                                            </Row>
                                        </td>
                                    </tr>
                                )
                            }</tbody>
                        </Table>

                        <Button
                            className='btn-add'
                            size="sm"
                            variant="light"
                            onClick={() => { setEditUser({ ...emptyUser }); setIsUserData(true) }}>
                            <img className='mr-2' src={imageAdd} alt="Hinzufügen" />
                            {t('translation:add-user')}
                        </Button>

                    </Card.Body>

                    <Card.Footer id='data-footer'>
                        <Row className='justify-content-end'>
                            <Col sm='6' md='3' className='p-0'>
                                <Button
                                    className='my-md-0 p-0'
                                    variant='primary'
                                    block
                                    onClick={() => context.navigation!.toLanding()}
                                >
                                    {t('translation:back')}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Fade>

            <UserModal
                show={isUserData}
                onCancel={() => {
                    setIsUserData(false);
                }}
                groups={groupNodes}
                handleOk={userUpdate}
                user={editUser}
            />

            <GroupModal
                show={isGroupEdit}
                onCancel={() => { setIsGroupEdit(false); }}
                groupId={editGroupId}
                parentGroupId={editGroupParentId}
                handleOk={groupUpdate}
                groups={groupNodes}
                handleError={(err: any) => {
                    setIsGroupEdit(false);
                    handleError(err);
                }
                }
            />

            <ConfirmModal
                show={showConfirm}
                title={confirmTitle}
                message={confirmMessage}
                onCancel={() => {
                    setConfirmHandle(undefined);
                    setShowConfirm(false);
                }}
                handleOk={() => {
                    if (confirmHandle) {
                        confirmHandle();
                    }
                }}
            />
        </>);

}

export default UserManagement;
