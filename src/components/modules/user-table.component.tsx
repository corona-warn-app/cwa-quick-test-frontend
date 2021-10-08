import React from "react";
import { Row, Table, Button, Collapse, Container, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";

import '../../i18n';
import { useTranslation } from 'react-i18next';

import CwaSpinner from "../spinner/spinner.component";
import ConfirmModal from "../modals/confirm-modal.component";
import UserModal from "../modals/user-modal.component";

import imageAdd from '../../assets/images/icon_add.svg'
// import AppContext from "../../misc/appContext";
import { IDisplayUser, IGroupNode, IUser } from "../../misc/user";
import { addUserToGroup, useGetUsers } from "../../api";
import { useKeycloak } from "@react-keycloak/web";

const emptyUser: IDisplayUser = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    subGroup: '',
    roleLab: false,
    roleCounter: false,
}

const UserTable = (props: any) => {

    // const context = React.useContext(AppContext);

    const { t } = useTranslation();
    const { keycloak } = useKeycloak();

    const handleSuccess = () => {
        setIsUserSuccessfullUpdated(true);
        setIsUserCreationError(false);
        setTimeout(setShowUserModal, 300, false);
        setShowConfirm(false);
    }

    const [bUsers,
        // refreshUsers,
        createUser,
        readUser,
        updateUser,
        deleteUser] = useGetUsers(handleSuccess, props.handleError);

    const [users, setUsers] = React.useState<IDisplayUser[]>([]);
    const [reload, setReload] = React.useState(true);

    const [showUserModal, setShowUserModal] = React.useState(false);
    const [isUserSuccessfullUpdated, setIsUserSuccessfullUpdated] = React.useState(false);
    const [isUserCreationError, setIsUserCreationError] = React.useState(false);
    const [editUser, setEditUser] = React.useState<IDisplayUser>(emptyUser);
    const [ownUserId, setOwnUserId] = React.useState<string>('');

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [confirmMessage, setConfirmMessage] = React.useState('');
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmHandle, setConfirmHandle] = React.useState<() => void>();

    // set user name from keycloak
    React.useEffect(() => {

        if (keycloak.idTokenParsed) {
            setOwnUserId((keycloak.idTokenParsed as any).sub ?? '');
        }

    }, [keycloak])

    React.useEffect(() => {
        if (bUsers) {
            setUsers(bUsers);
            setEditUser({ ...emptyUser });
        }
    }, [bUsers]);

    React.useEffect(() => {
        if (props.userReload) {
            users.forEach((user => updateDisplayUser(user, false)));
            props.setUserReload(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userReload]);

    React.useEffect(() => {
        if (props.groupNodes && users && users.length > 0 && reload) {
            setReload(false);
            users.forEach((user => updateDisplayUser(user, true)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.groupNodes), users, reload]);

    const sortUsers = () => {
        users.sort((a, b) => {
            const nameA = a.username.toUpperCase(); // ignore upper and lowercase
            const nameB = b.username.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
    }

    const addDisplayUser = (user: IDisplayUser) => {
        setGroupPath(user);
        user.displayRole = getDisplayRole(user);
        users.push(user);
        sortUsers();

        setUsers(users);
    }

    const updateDisplayUser = (user: IDisplayUser, withApi: boolean, onSuccess?: () => void) => {
        // set all groupPath for display
        setGroupPath(user);

        // set all rollDisplay async
        if (withApi) {
            readUser(user)
                .then((response) => {
                    user.roleCounter = response.data.roleCounter;
                    user.roleLab = response.data.roleLab;

                    user.displayRole = getDisplayRole(user);
                })
                .finally(() => {
                    updateUsers(user);
                    if (onSuccess) {
                        onSuccess();
                    }
                })
        }
        else {
            updateUsers(user);
        }
    }

    const updateUsers = (user: IDisplayUser | IUser) => {
        const _users: IDisplayUser[] = [...users];

        _users[_users.findIndex(_user => user.id === _user.id)] = { ...user };

        setUsers(_users);
    }
    const removeUsers = (user: IDisplayUser | IUser) => {
        users.splice(users.findIndex(_user => user.id === _user.id), 1);
        setUsers(users);
    }

    const userUpdate = (user: IUser) => {
        if (editUser && editUser.username) {
            const fuser = users.find(u => u.username === user.username);

            if (!user.password) {
                user.password = undefined;
            }

            updateUser(user)
                .then(() => {
                    if (
                        fuser
                        && fuser.subGroup !== user.subGroup
                        && keycloak.token
                        && user.subGroup
                    ) {
                        addUserToGroup(user.id, user.subGroup, keycloak.token)
                            .then(() => {
                                updateDisplayUser(user, true, handleSuccess);
                            })
                            .catch(e => {
                                props.handleError(e);
                            });
                    } else {
                        updateDisplayUser(user, true, handleSuccess);
                    }
                })

        } else {
            const newUser: any = { ...user };

            createUser(newUser)
                .then((response) => {
                    const displayUser: IDisplayUser = { ...response.data };
                    addDisplayUser(displayUser);
                    handleSuccess();
                })
                .catch(e => {
                    if (e && e.message && (e.message as string).includes('409')) {
                        setIsUserCreationError(true);
                    }
                    else {
                        props.handleError(e);
                    }
                })
        }
    }

    const startEditUser = (user: IUser) => {
        setEditUser({ ...user });
        setShowUserModal(true);
    }

    const handleDeleteUser = (user: IDisplayUser) => {
        setConfirmTitle(t('translation:delete-user-title', { userName: user.username }));
        setConfirmMessage('');
        setShowConfirm(true);

        const handle = () => {
            if (keycloak.token && user.username) {
                deleteUser(user.id)
                    .then(() => {
                        removeUsers(user);
                        handleSuccess();
                    })
                    .catch(e => {
                        props.handleError(e);
                    })
            }
        };
        // need to wrap a function again because react apply each function passed to hook
        setConfirmHandle(() => handle);
    }

    const getDisplayRole = (user: IUser) => {
        let roleString = '';

        if (user.roleLab) {
            roleString = t('translation:lab');
        }

        if (user.roleCounter) {
            if (roleString) {
                roleString += ', ';
            }
            roleString += t('translation:counter');
        }

        return roleString;
    }

    const setGroupPath = (user: IDisplayUser) => {
        if (user.subGroup) {
            const _groupName = getGroupPath(user.subGroup);

            if (_groupName) {
                user.displayGroup = _groupName;
            }
            else {
                user.subGroup = '';
                user.displayGroup = '';
            }
        }
        else {
            user.displayGroup = '';
        }
    }

    const getGroupPath = (groupId: string | null): string => {
        let groupName = ''

        if (props.groupNodes && groupId) {
            const fNode = (props.groupNodes as IGroupNode[]).find(gnode => gnode.group.id === groupId);

            if (fNode) {
                groupName = fNode.group.path;
            }
        }

        return groupName;
    }

    return (<>
        {
            !(users && users.length > 0)
                ? <CwaSpinner background='#eeeeee' />
                : <Collapse appear={true} in={true}>
                    <Container className='p-0 '>
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>{t('translation:user-name')}</th>
                                    <th>{t('translation:first-name')}</th>
                                    <th>{t('translation:name')}</th>
                                    <th>{t('translation:group')}</th>
                                    <th>{t('translation:permission')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>{
                                users.map((u, i) =>
                                    <tr key={i}>
                                        <td>{u.subGroup || (ownUserId && u.id === ownUserId)
                                            ? <></>
                                            : <OverlayTrigger
                                                placement='top-end'
                                                overlay={
                                                    <Tooltip id='no-group-tooltip'>
                                                        {t('translation:no-group-tooltip')}
                                                    </Tooltip>
                                                }
                                            >
                                                <span className='ff-fa px-1'>&#xf071; </span>
                                            </OverlayTrigger>}
                                            {u.username}</td>
                                        <td>{u.firstName}</td>
                                        <td>{u.lastName}</td>
                                        <td>
                                            {
                                                u.displayGroup
                                                    ? u.displayGroup
                                                    : u.subGroup
                                                        ? <Spinner
                                                            animation="border"
                                                            className='d-flex mx-auto'
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            variant='primary'
                                                        />
                                                        : <></>
                                            }
                                        </td>
                                        <td>{
                                            u.displayRole !== undefined
                                                ? u.displayRole
                                                : <Spinner
                                                    animation="border"
                                                    className='d-flex mx-auto'
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    variant='primary'
                                                />
                                        }
                                        </td>
                                        <td className='td-btn'>
                                            <Row className='m-0 justify-content-around'>
                                                <Button
                                                    className="btn-icon edit-icon"
                                                    onClick={() => startEditUser({ ...u })}
                                                >
                                                </Button>
                                                <Button className="btn-icon delete-icon"
                                                    onClick={() => handleDeleteUser(u)}
                                                    disabled={!(ownUserId && u.id !== ownUserId)}
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
                            onClick={() => { setEditUser({ ...emptyUser }); setShowUserModal(true) }}>
                            <img className='mr-2' src={imageAdd} alt="Hinzufügen" />
                            {t('translation:add-user')}
                        </Button>
                    </Container>
                </Collapse>
        }


        <UserModal
            show={showUserModal}
            groups={props.groupNodes}
            handleOk={userUpdate}
            user={editUser}
            onEnter={() => setIsUserSuccessfullUpdated(false)}
            isSuccess={isUserSuccessfullUpdated}
            isCreationError={isUserCreationError}
            resetError={() => setIsUserCreationError(false)}
            onCancel={() => setShowUserModal(false)}
            onExit={
                () => {
                    setEditUser({ ...emptyUser });
                    setIsUserSuccessfullUpdated(false);
                    setIsUserCreationError(false);
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
    </>
    )

}

export default UserTable;
