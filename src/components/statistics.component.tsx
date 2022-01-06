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
import { Button, Card, Col, Fade, Form, Row } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';

import CwaSpinner from './spinner/spinner.component';
import { useGetStatisticsFromTo, useStatistics } from '../api';
import CardHeader from './modules/card-header.component';
import AppContext from '../misc/appContext';
import StatisticDataRow, { StatisticDateSelectionRow, StatisticHeaderRow } from './modules/statistic-data.component';
import StatisticData from '../misc/statistic-data';
import utils from '../misc/utils';
import { format } from "date-fns";

const Statistics = (props: any) => {

    const context = React.useContext(AppContext);
    const { t } = useTranslation();
    const { keycloak } = useKeycloak();
    

    

    const handleError = (error: any) => {
        let msg = '';

        if (error) {
            msg = error.message
        }

        if (error && error.message && (error.message as string).includes('412')) {
            msg = t('translation:no-group-error');
        }
        props.setError({ error: error, message: msg, onCancel: context.navigation!.toLanding });
    }

    const [pcrEnabled, setPcrEnabled] = React.useState(false);
    const [statisticData,
        thisWeekStatisticData,
        thisMonthStatisticData] = useStatistics(undefined, handleError);
    const [statisticsResult,
        getStatisticsFromTo] = useGetStatisticsFromTo(undefined, handleError);
    const [isInit, setIsInit] = React.useState(false);
    const [statisticRows, setStatisticRows] = React.useState<any[]>([]);
    const [dateValidFrom, setDateValidFrom] = React.useState<Date>();
    const [dateValidTo, setDateValidTo] = React.useState<Date>();

    React.useEffect(() => {

        if (keycloak.idTokenParsed) {
            setPcrEnabled(!!(keycloak.idTokenParsed as any).pcr_enabled);
        }

    }, [keycloak])

    React.useEffect(() => {
        if (context.navigation && context.valueSets && statisticData && thisWeekStatisticData && thisMonthStatisticData) {
            setStatisticRows([
                <StatisticDataRow statisticData={statisticData} label={t('translation:today')} key={0} pcrEnabled={pcrEnabled}/>,
                <StatisticDataRow statisticData={thisWeekStatisticData} label={t('translation:thisWeek')} key={1} pcrEnabled={pcrEnabled}/>,
                <StatisticDataRow statisticData={thisMonthStatisticData} label={t('translation:thisMonth')} key={2} pcrEnabled={pcrEnabled}/>
            ])
            setIsInit(true);
        }
    }, [context.navigation, context.valueSets, statisticData, thisWeekStatisticData, thisMonthStatisticData])

    React.useEffect(() => {
        if (dateValidFrom && dateValidTo) {
            getStatisticsFromTo(dateValidFrom, dateValidTo!);
        }
    }, [dateValidFrom, dateValidTo])

    React.useEffect(() => {
        if (statisticsResult) {

            let newLabel: string | undefined = dateValidFrom ? format(dateValidFrom, utils.pickerDateFormat) : undefined;
            if (newLabel && dateValidTo) {
                newLabel += ' - ' + format(dateValidTo, utils.pickerDateFormat);
            }

            const newStatisticData: StatisticData = statisticsResult;

            let tmpStatisticRows: JSX.Element[] = [...statisticRows];
            tmpStatisticRows.push(<StatisticDataRow statisticData={newStatisticData} label={newLabel} key={statisticRows.length} pcrEnabled={pcrEnabled}/>);
            setStatisticRows(tmpStatisticRows);
        }
    }, [statisticsResult])

    const handleNewStatisticRow = (dateValidFrom: Date, dateValidTo: Date) => {
        setDateValidFrom(dateValidFrom);

        if (dateValidTo) {
            setDateValidTo(dateValidTo);
        } else {
            setDateValidTo(dateValidFrom);
        }
    }

    return (
        !(isInit && context && context.valueSets && statisticData && thisWeekStatisticData && thisMonthStatisticData)
            ? <CwaSpinner />
            : <Fade appear={true} in={true} >
                <Card id='data-card'>
                    <CardHeader title={t('translation:statistics')} />

                    {/*
    content area with patient inputs and check box
    */}
                    <Card.Body id='data-header'>
                        <StatisticHeaderRow pcrEnabled={pcrEnabled}/>
                        <hr />
                        {statisticRows}
                        <StatisticDateSelectionRow addRow={handleNewStatisticRow} />
                        <hr />
                    </Card.Body>

                    {/*
    footer with correction and finish button
    */}
                    <Card.Footer id='data-footer'>
                        <Row>
                            <Col sm='6' md='3' className='pr-md-0'>
                                <Button
                                    className='my-1 my-md-0 p-0'
                                    block
                                    onClick={context.navigation!.toLanding}
                                >
                                    {t('translation:cancel')}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Fade>
    )
}

export default Statistics;