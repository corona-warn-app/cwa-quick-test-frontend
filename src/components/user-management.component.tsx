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
import UserModal from './user-modal.component';
import GroupModal from './group-modal.component';
import ConfirmModal from './confirm-modal.component';

import AppContext from '../misc/appContext';
import { IUser, IGroup, IGroupDetails, IGroupNode } from '../misc/user';
import { useGetUsers, useGetGroups, createUser, createGroup, deleteUser, deleteGroup, updateGroup, addUserToGroup } from '../api';
import { useKeycloak } from '@react-keycloak/web';

import imageEdit from '../assets/images/icon_edit.svg'
import imageDelete from '../assets/images/icon_delete.svg'
import imageAdd from '../assets/images/icon_add.svg'

const emptyUser: IUser = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    subGroup: null,
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

    const { keycloak, initialized } = useKeycloak();
    const [bUsers, refreshUsers] = useGetUsers(handleError);
    const [bGroups, refreshGroups] = useGetGroups(handleError);
    const [users, setUsers] = React.useState<IUser[]>([]);
    const [groups, setGroups] = React.useState<IGroup[]>([]);
    const [isInit, setIsInit] = React.useState(true);
    const [isUserData, setIsUserData] = React.useState(false);
    const [editUser, setEditUser] = React.useState<IUser>(emptyUser);
    const [isGroupEdit, setIsGroupEdit] = React.useState(false);
    const [editGroupId, setEditGroupId] = React.useState<string>('');

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [confirmMessage, setConfirmMessage] = React.useState('');
    const [confirmHandle, setConfirmHandle] = React.useState<() => void>();
    const [isUpdating, setIsUpdating] = React.useState(false);

    React.useEffect(() => {
        if (bUsers) {
            setUsers(bUsers);
        }
        setIsInit(!!(bGroups && bUsers));
        setIsUpdating(false);
    }, [bUsers]);

    React.useEffect(() => {
        if (bGroups) {
            setGroups(bGroups);
        }
        setIsInit(!!(bGroups && bUsers));
        setIsUpdating(false);
    }, [bGroups]);


    const userUpdate = (user:IUser) => {
        if (editUser && editUser.username) {
            const fuser = users.find(u => u.username === user.username);
            if (fuser && fuser.subGroup!==user.subGroup) {
                if (keycloak.token && user.subGroup && user.subGroup!=='empty') {
                    setIsUpdating(true);
                    addUserToGroup(user.id, user.subGroup, keycloak.token).then(() => {
                        refreshUsers();
                    }).catch(e => {
                        handleError(e);
                    });
                }
            }
        } else {
            const newUser: any = {...user};
            delete newUser.subGroup;
            if (keycloak.token) {
                setIsUpdating(true);
                createUser(newUser, keycloak.token).then(() => {
                    if (newUser.subGroup && keycloak.token && newUser.subGroup!=='empty') {
                        addUserToGroup(newUser.id, newUser.subGroup, keycloak.token).then(() => {
                            refreshUsers();
                        }).catch(e => {
                            handleError(e);
                        });
                    } else {
                        refreshUsers();
                    }
                }).catch(e => {
                    handleError(e);
                });
            }
        }
        setIsUserData(false);
    }

    const groupUpdate = (group:IGroupDetails) => {
        if (group.id) {
            if (keycloak.token) {
                setIsUpdating(true);
                updateGroup(group, keycloak.token).then(() => {
                    refreshGroups();
                }).catch(e => {
                    handleError(e);
                });
            }
        } else {
            if (keycloak.token) {
                createGroup(group, keycloak.token).then(() => {
                    refreshGroups();
                }).catch(e => {
                    handleError(e);
                });
            }
        }
        setIsGroupEdit(false);
    }

    const startEditGroup = (group:IGroup) => {
        setEditGroupId(group.id);
        setIsGroupEdit(true);
    }

    const handleDeleteGroup = (group:IGroup) => {
        setConfirmMessage("Wollen Sie wirklich die Gruppe "+group.name+ " löschen?")
        setShowConfirm(true);
        const handle = () => {
            if (keycloak.token && group.id) {
                deleteGroup(group.id, keycloak.token).then(() => {
                    refreshGroups();
                }).catch(e => {
                    handleError(e);
                });
            }
        };
        // need to wrap a function again because react apply each function passed to hook
        setConfirmHandle(() => handle);
    }

    const startEditUser = (user: IUser) => {
        setEditUser({...user});
        setIsUserData(true);
    }

    const handleDeleteUser = (user:IUser) => {
        setConfirmMessage("Wollen Sie wirklich den User "+user.username+ " löschen?")
        setShowConfirm(true);
        const handle = () => {
            if (keycloak.token && user.username) {
                deleteUser(user.id, keycloak.token).then(() => {
                    refreshUsers();
                }).catch(e => {
                    handleError(e);
                });
            }
        };
        // need to wrap a function again because react apply each function passed to hook
        setConfirmHandle(() => handle);
    }

    const rolesAsString = (user:IUser) => {
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


    const flattenGroups = (groups: IGroup[], groupNodes: IGroupNode[], level: number): void => {
        groups.forEach((group: IGroup) => {
            const gNode: IGroupNode = {
                group: group,
                level: level,
            };
            groupNodes.push(gNode);
            if (group.children) {
                flattenGroups(group.children, groupNodes, level+1);
            }
        });
    }

    const nameWithIdent = (groupNode: IGroupNode) : string => {
        return "\u00A0\u00A0\u00A0\u00A0".repeat(groupNode.level)+groupNode.group.name;
    }

    const groupNodes: IGroupNode[] = [];
    flattenGroups(groups, groupNodes, 0);

    const groupRows = groupNodes.map(g => <tr><td width="90%">{nameWithIdent(g)}</td><td width="10%">
        <Button className="btn-icon" size="sm" disabled={isUpdating} onClick={() => startEditGroup(g.group)}><img src={imageEdit}/></Button>&nbsp;&nbsp;
        <Button className="btn-icon" size="sm" disabled={isUpdating} onClick={() => handleDeleteGroup(g.group)}><img src={imageDelete}/></Button></td></tr>);

    const groupName = (groupId: string|null): string => {
        let groupName = ''
        if (groupId) {
            const fNode = groupNodes.find(gnode => gnode.group.id == groupId);
            if (fNode) {
                groupName = fNode.group.path;
            }
        }
        return groupName;
    }


    const userRows = users.map(u => <tr><td>{u.username}</td><td>{u.firstName}</td><td>{u.lastName}</td>
        <td>{groupName(u.subGroup)}</td><td>{rolesAsString(u)}</td>
        <td width="10%"><Button className="btn-icon" size="sm" disabled={isUpdating} onClick={() => startEditUser({...u})}><img src={imageEdit}/></Button>&nbsp;&nbsp;
        <Button className="btn-icon" size="sm" disabled={isUpdating} onClick={() => handleDeleteUser(u)}><img src={imageDelete}/></Button></td></tr>);


    return (!(isInit && context && context.valueSets)
            ? <CwaSpinner />
            : <>
                <Fade appear={true} in={true} >
                <Card id='data-card'>
                    <CardHeader title={t('translation:user-management')} />
                    <Card.Body id='data-header'>
                        <h4>Benutzer</h4>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Benutzername</th>
                                    <th>Vorname</th>
                                    <th>Name</th>
                                    <th>Gruppe</th>
                                    <th>Rollen</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRows}
                            </tbody>
                        </Table>
                        <Button size="sm" disabled={isUpdating} variant="light"
                        onClick={() => {setEditUser({...emptyUser}); setIsUserData(true)}}><img src={imageAdd}/> Neuen Benutzer hinzufügen</Button>
                        <hr/>
                        <h4>Gruppen</h4>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupRows}
                            </tbody>
                        </Table>
                        <Button size="sm" variant="light"
                            disabled={isUpdating}
                            onClick={() => {setEditGroupId(''); setIsGroupEdit(true)}}><img src={imageAdd}/> Neue Gruppe hinzufügen</Button>
                        {isUpdating ? <CwaSpinner /> : null}
                    </Card.Body>
                    <Card.Footer id='data-footer'>
                        <Row>
                            <Col sm='6' md='3' className=''>
                                <Button
                                    className='my-1 my-md-0 p-0'
                                    variant='outline-primary'
                                    block
                                    onClick={() => context.navigation!.toLanding()}
                                >Zurück</Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
                </Fade>
                <UserModal show={isUserData} 
                    onCancel={() => setIsUserData(false)} 
                    groups={groupNodes} 
                    handleOk={userUpdate}
                    user={editUser}
                    />
                <GroupModal show={isGroupEdit} 
                    onCancel={() => setIsGroupEdit(false)}
                    groupId={editGroupId} 
                    handleOk={groupUpdate}
                    handleError={(err: any) => {
                        setIsGroupEdit(false);
                        handleError(err);
                    }}
                    />
                <ConfirmModal show={showConfirm}
                    message={confirmMessage}
                    onCancel={() => {
                        setConfirmHandle(undefined);
                        setShowConfirm(false);
                    }} 
                    handleOk={() => {
                        setShowConfirm(false);
                        if (confirmHandle) {
                            confirmHandle();
                        }
                    }}
                    />
                </>);
        
}

export default UserManagement;