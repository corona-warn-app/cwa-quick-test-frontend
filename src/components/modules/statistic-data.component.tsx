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

import React, { Fragment } from "react";
import { Button, Col, Form, Row } from 'react-bootstrap';

import '../../i18n';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';

import StatisticData from "../../misc/statistic-data";
import utils from "../../misc/utils";

const StatisticDataRow = (props: any) => {
    const { t } = useTranslation();

    const [label, setLabel] = React.useState<String>('');
    const [ratTestCount, setRatTestCount] = React.useState<number>(0);
    const [ratPositiveTestCount, setRatPositiveTestCount] = React.useState<number>(0);
    const [pcrTestCount, setPcrTestCount] = React.useState<number>(0);
    const [pcrPositiveTestCount, setPcrPositiveTestCount] = React.useState<number>(0);
    const [pcrEnabled, setPcrEnabled] = React.useState(false);

    React.useEffect(() => {
        if (props && props.statisticData) {
            const statisticData: StatisticData = props.statisticData;

            setRatTestCount(statisticData.ratTestCount);
            setRatPositiveTestCount(statisticData.ratPositiveTestCount);
            setPcrTestCount(statisticData.pcrTestCount);
            setPcrPositiveTestCount(statisticData.pcrPositiveTestCount);

            setLabel(props.label);

            setPcrEnabled(props.pcrEnabled);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <Fragment>
            <Row>
                <Col xs='12' md='3'>
                    <Form.Label className='input-label jcc-xs-jcfs-md mb-md-0'>{label}</Form.Label>
                </Col>

                <Col md='9'>
                    <Row className='text-center'>
                        <Col xs='6' md={pcrEnabled ? '3' : '6'}>
                            {ratTestCount}
                        </Col>
                        <Col xs='6' md={pcrEnabled ? '3' : '6'}>
                            {ratTestCount > 0 ? ratPositiveTestCount +
                                ' ( ' + (100 * ratPositiveTestCount / ratTestCount).toFixed(2) + "% )" : 0}
                        </Col>
                        {!pcrEnabled
                            ? <></>
                            : <>
                                <Col xs='6' md='3'>
                                    {pcrTestCount}
                                </Col>
                                <Col xs='6' md='3'>
                                    {pcrTestCount > 0 ? pcrPositiveTestCount +
                                        ' ( ' + (100 * pcrPositiveTestCount / pcrTestCount).toFixed(2) + "% )" : 0}
                                </Col>
                            </>
                        }
                    </Row>
                </Col>
            </Row>
            <hr />
        </Fragment>
    )
}

export default StatisticDataRow;

export const StatisticHeaderRow = (props: any) => {
    const { t } = useTranslation();
    const [pcrEnabled, setPcrEnabled] = React.useState(false);


    React.useEffect(() => {
        if (props) {
            setPcrEnabled(props.pcrEnabled);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Row className='text-center'>
            <Col xs='12' md='3'>
                &nbsp;
            </Col>
            <Col md='9'>
                <Row className='text-center'>
                    <Col xs='6' md={pcrEnabled ? '3' : '6'}>
                        {t('translation:totalTestCount')}
                    </Col>
                    <Col xs='6' md={pcrEnabled ? '3' : '6'}>
                        {t('translation:positiveTestCount')}
                    </Col>
                    {!pcrEnabled
                        ? <></>
                        : <>
                            <Col xs='6' md='3'>
                                {t('translation:pcrTotalTestCount')}
                            </Col>
                            <Col xs='6' md='3'>
                                {t('translation:pcrPositiveTestCount')}
                            </Col>
                        </>
                    }
                </Row>
            </Col>
        </Row>)
}

export const StatisticDateSelectionRow = (props: any) => {
    const { t } = useTranslation();

    const [dateValidFrom, setDateValidFrom] = React.useState<Date>();
    const [dateValidTo, setDateValidTo] = React.useState<Date>();

    const handleDateValidFrom = (evt: Date | [Date, Date] | null) => {
        const date = handleDateChange(evt);
        setDateValidFrom(date);
        if (date === null) {
            setDateValidTo(undefined);
        }
    }

    const handleDateValidTo = (evt: Date | [Date, Date] | null) => {
        const date = handleDateChange(evt);
        setDateValidTo(date);
    }

    const handleDateChange = (evt: Date | [Date, Date] | null) => {
        let date: Date;

        if (Array.isArray(evt))
            date = evt[0];
        else
            date = evt as Date;

        if (date) {
            date.setHours(12);
        }

        return date;
    }

    return (
        <Form.Group as={Row} controlId='formDateValidFromToInput' className='pb-3 mb-0'>
            <Form.Label className='input-label jcc-xs-jcfs-md mb-md-0' column xs='12' sm='3'>{t('translation:timerange')}</Form.Label>

            <Col xs='9' md='6' className='d-flex'>
                <DatePicker
                    selected={dateValidFrom}
                    onChange={handleDateValidFrom}
                    dateFormat={utils.pickerDateFormat}
                    isClearable
                    placeholderText={t('translation:from')}
                    className='qt-input form-control'
                    wrapperClassName='align-self-center'
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    minDate={new Date(2020, 0, 1, 12)}
                    openToDate={dateValidFrom ? dateValidFrom : new Date()}
                />
                <span className='space-five'>{'-'}</span>
                <DatePicker
                    selected={dateValidTo}
                    onChange={handleDateValidTo}
                    dateFormat={utils.pickerDateFormat}
                    isClearable
                    placeholderText={t('translation:to')}
                    className='qt-input form-control'
                    wrapperClassName='align-self-center'
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    minDate={dateValidFrom}
                    openToDate={dateValidTo ? dateValidTo : new Date()}
                    disabled={dateValidFrom === undefined}
                />
            </Col>
            <Col xs='3' md='3' className='d-flex'>
                <Button
                    className='my-1 my-md-0 p-0'
                    block
                    onClick={() => { props.addRow(dateValidFrom, dateValidTo) }}
                    disabled={!dateValidFrom}
                >
                    {t('translation:addStatisticRow')}
                </Button>
            </Col>
        </Form.Group>
    )
}


