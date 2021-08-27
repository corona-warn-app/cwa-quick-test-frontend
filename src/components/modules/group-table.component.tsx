import React from "react";
import { Row, Table, Button, Collapse, Container } from "react-bootstrap";

import '../../i18n';
import { useTranslation } from 'react-i18next';

import CwaSpinner from "../spinner/spinner.component";
import GroupModal from "../modals/group-modal.component";
import ConfirmModal from "../modals/confirm-modal.component";

import imageAdd from '../../assets/images/icon_add.svg'
import AppContext from "../../misc/appContext";
import utils from "../../misc/utils";
import { IGroup, IGroupDetails, IGroupNode } from "../../misc/user";
import { addGroupAsChild, useGetGroups } from "../../api";
import { useKeycloak } from "@react-keycloak/web";

const GroupTable = (props: any) => {

    const context = React.useContext(AppContext);

    const { t } = useTranslation();
    const { keycloak } = useKeycloak();

    const handleSuccess = () => {
        setIsGroupEdit(false);
        setShowConfirm(false);
    }

    const [
        bGroups,
        refreshGroups,
        createGroup,
        updateGroup,
        deleteGroup
    ] = useGetGroups(handleSuccess, props.handleError);

    const [isGroupEdit, setIsGroupEdit] = React.useState(false);
    const [editGroupId, setEditGroupId] = React.useState<string>('');
    const [editGroupParentId, setEditGroupParentId] = React.useState<string>('');
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [confirmMessage, setConfirmMessage] = React.useState('');
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmHandle, setConfirmHandle] = React.useState<() => void>();


    React.useEffect(() => {
        if (bGroups) {
            const _groupNodes: IGroupNode[] = [];
            flattenGroups(bGroups, _groupNodes, 0);
            props.setGroupNodes(_groupNodes);
        }
        else {
            props.setGroupNodes([]);
        }
    }, [bGroups]);

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

    const groupUpdate = (group: IGroupDetails) => {
        if (group.id) {

            if (keycloak.token) {

                const uGroup: any = { ...group };
                delete uGroup.parentGroup;

                updateGroup(uGroup)
                    .then(() => {
                        const fgroupNode = props.groupNodes.find((groupNode: IGroupNode) => groupNode.group.id === group.id);

                        if (keycloak.token
                            && fgroupNode
                            && group.id
                            && group.parentGroup
                            && fgroupNode.parentGroup !== group.parentGroup) {
                            addGroupAsChild(group.id, group.parentGroup, keycloak.token)
                                .then(() => {
                                    refreshGroups(() => { handleSuccess(); props.setUserReload(true); });
                                })
                                .catch(e => {
                                    props.handleError(e);
                                });
                        } else {
                            refreshGroups(() => { handleSuccess(); props.setUserReload(true); });
                        }
                    })
                    .catch(e => {
                        props.handleError(e);
                    })
            }
        } else {
            if (keycloak.token) {
                createGroup(group)
                    .then(() => {
                        refreshGroups(handleSuccess);
                    })
                    .catch(e => {
                        props.handleError(e);
                    })
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
                deleteGroup(group.id)
                    .then(() => {
                        refreshGroups(() => { handleSuccess(); props.setUserReload(true); });

                    })
                    .catch(e => {
                        props.handleError(e);
                    })
            }
        };
        // need to wrap a function again because react apply each function passed to hook
        setConfirmHandle(() => handle);
    }

    return (<>
        {
            !(props.groupNodes)
                ? <CwaSpinner background='#eeeeee' />
                : <Collapse appear={true} in={true}>
                    <Container className='p-0 '>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>{t('translation:name')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>{
                                props.groupNodes.map((g: IGroupNode, i: number) =>
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
                    </Container>
                </Collapse>
        }

        <GroupModal
            show={isGroupEdit}
            onCancel={() => { setIsGroupEdit(false); }}
            groupId={editGroupId}
            parentGroupId={editGroupParentId}
            handleOk={groupUpdate}
            groups={props.groupNodes}
            handleError={(err: any) => {
                setIsGroupEdit(false);
                props.handleError(err);
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

export default GroupTable;
