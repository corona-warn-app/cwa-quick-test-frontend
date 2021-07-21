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
import { Card, Fade, Table, Button } from 'react-bootstrap';
import CwaSpinner from './spinner/spinner.component';
import CardHeader from './modules/card-header.component';
import { useTranslation } from 'react-i18next';
import UserModal from './user-modal.component';
import GroupModal from './group-modal.component';
import ConfirmModal from './confirm-modal.component';

import AppContext from '../misc/appContext';
import { IUser, IGroup } from '../misc/user';
import { useGetUsers, useGetGroups } from '../api';

const emptyUser: IUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    group: '',
    roleLab: false,
    roleCounter: false,
}

const emptyGroup: IGroup = {
    id: '',
    name: '',
    data: '',
}

const UserManagment = (props: any) => {
    const context = React.useContext(AppContext);
    const { t } = useTranslation();


    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        props.setError({ error: error, message: msg, onCancel: context.navigation!.toLanding });
    }

    const bUsers = useGetUsers(handleError);
    const bGroups = useGetGroups(handleError);
    const [users, setUsers] = React.useState<IUser[]>([]);
    const [groups, setGroups] = React.useState<IGroup[]>([]);
    const [isInit, setIsInit] = React.useState(true);
    const [isUserData, setIsUserData] = React.useState(false);
    const [editUser, setEditUser] = React.useState<IUser>(emptyUser);
    const [isGroupEdit, setIsGroupEdit] = React.useState(false);
    const [editGroup, setEditGroup] = React.useState<IGroup>(emptyGroup);

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [confirmMessage, setConfirmMessage] = React.useState('');
    const [confirmHandle, setConfirmHandle] = React.useState<() => void>();

    React.useEffect(() => {
        if (bUsers) {
            setUsers(bUsers);
        }
        setIsInit(!!(bGroups && bUsers));
    }, [bUsers]);

    React.useEffect(() => {
        if (bGroups) {
            setGroups(bGroups);
        }
        setIsInit(!!(bGroups && bUsers));
    }, [bGroups]);


    const userUpdate = (user:IUser) => {
        if (editUser && editUser.email) {
            const fuser = users.find(u => u.email === user.email);
            if (fuser) {
                fuser.firstName = user.firstName;
                fuser.lastName = user.lastName;
                fuser.group = user.group;
                fuser.roleCounter = user.roleCounter;
                fuser.roleLab = user.roleLab;
            }
        } else {
            users.push(user);
        }
        setUsers(users);
        setIsUserData(false);
    }

    const toBeDone = () => {
        window.alert("TO BE DONE");
    }

    const groupUpdate = (group:IGroup) => {
        if (group.id) {
            const fgroup = groups.find(g => g.id === group.id);
            if (fgroup) {
                fgroup.name = group.name;
                fgroup.data = group.data;
            }
        } else {
            // TODO fake id
            group.id = Math.floor(Math.random()*100000).toString();
            groups.push(group)
        }
        setGroups(groups);
        setIsGroupEdit(false);
    }

    const startEditGroup = (group:IGroup) => {
        setEditGroup(group);
        setIsGroupEdit(true);
    }

    const deleteGroup = (group:IGroup) => {
        setConfirmMessage("Wollen Sie wirklich die Gruppe "+group.name+ " löschen?")
        setShowConfirm(true);
        const handle = () => {
            setGroups(groups.filter(g => g.id !== group.id));
        };
        // need to wrap a function again because react apply each function passed to hook
        setConfirmHandle(() => handle);
    }

    const startEditUser = (user: IUser) => {
        setEditUser(user);
        setIsUserData(true);
    }

    const deleteUser = (user:IUser) => {
        setConfirmMessage("Wollen Sie wirklich den User "+user.email+ " löschen?")
        setShowConfirm(true);
        const handle = () => {
            setUsers(users.filter(u => u.email !== user.email));
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


    const userRows = users.map(u => <tr><td>{u.email}</td><td>{u.firstName}</td><td>{u.lastName}</td>
        <td>{u.group}</td><td>{rolesAsString(u)}</td>
        <td><Button size="sm" onClick={() => startEditUser({...u})}>Bearbeiten</Button>&nbsp;
        <Button size="sm" onClick={() => deleteUser(u)}>Löschen</Button></td></tr>);

    const groupRows = groups.map(g => <tr><td>{g.name}</td><td>{g.id}</td><td>
        <Button size="sm" onClick={() => startEditGroup(g)}>Bearbeiten</Button>&nbsp;
        <Button size="sm" onClick={() => deleteGroup(g)}>Löschen</Button>
        &nbsp;<Button size="sm" onClick={toBeDone}>Neue Untergruppe</Button></td></tr>);

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
                                    <th>email</th>
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
                        <Button onClick={() => {setEditUser({...emptyUser}); setIsUserData(true)}}>Neuen Benutzer Hinzufügen</Button>
                        <hr/>
                        <h4>Gruppen</h4>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Id</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupRows}
                            </tbody>
                        </Table>
                        <Button onClick={() => {setEditGroup(emptyGroup); setIsGroupEdit(true)}}>Neue Gruppe Hinzufügen</Button>
                        <hr/>
                        <Button onClick={() => context.navigation!.toLanding()}>Zurück zu Hauptmenü</Button>
                    </Card.Body>
                </Card>
                </Fade>
                <UserModal show={isUserData} 
                    onCancel={() => setIsUserData(false)} 
                    groups={groups.map(g => g.name)} 
                    handleOk={userUpdate}
                    user={editUser}
                    />
                <GroupModal show={isGroupEdit} 
                    onCancel={() => setIsGroupEdit(false)} 
                    group={editGroup} 
                    handleOk={groupUpdate}
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

export default UserManagment;