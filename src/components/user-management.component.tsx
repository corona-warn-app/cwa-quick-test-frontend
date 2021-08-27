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
import { Card, Fade, Button, Row, Col } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import CwaSpinner from './spinner/spinner.component';
import AppContext from '../misc/appContext';
import CardHeader from './modules/card-header.component';
import GroupTable from './modules/group-table.component';
import UserTable from './modules/user-table.component';
import { IGroupNode } from '../misc/user';


const UserManagement = (props: any) => {
    const context = React.useContext(AppContext);
    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(true);
    const [groupNodes, setGroupNodes] = React.useState<IGroupNode[]>();
    const [userReload, setUserReload] = React.useState(false);


    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }
        props.setError({ error: error, message: msg, onCancel: context.navigation!.toLanding });
    }

    React.useEffect(() => {
        //setIsInit(!!(bGroups && bUsers));
        setIsInit(!!(context && context.navigation, context.valueSets));
    }, [context.navigation, context.valueSets]);


    return (
        !(isInit && context && context.valueSets)
            ? <CwaSpinner />
            : <Fade appear={true} in={true} >
                <Card id='data-card'>

                    <CardHeader title={t('translation:user-management')} />

                    <Card.Body id='data-body' className='pt-0' >

                        <h4>{t('translation:groups')}</h4>

                        <GroupTable
                            groupNodes={groupNodes}
                            setGroupNodes={setGroupNodes}
                            setUserReload={setUserReload}
                            handleError={handleError}
                        />

                        <hr />

                        <h4>{t('translation:user')}</h4>

                        <UserTable
                            groupNodes={groupNodes}
                            handleError={handleError}
                            setUserReload={setUserReload}
                            userReload={userReload}
                        />

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
    );

}

export default UserManagement;
