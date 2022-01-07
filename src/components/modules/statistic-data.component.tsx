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

import React from "react";
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

import '../../i18n';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';

import { DisplayStatisticData } from "../../misc/statistic-data";
import utils from "../../misc/utils";
import imageAdd from '../../assets/images/icon_add.svg'

const StatisticDataRow = (props: any) => {
    const { t } = useTranslation();

    const [pcrEnabled, setPcrEnabled] = React.useState(false);
    const [statisticRows, setStatisticRows] = React.useState<DisplayStatisticData[]>([]);

    React.useEffect(() => {
        if (props && props.statisticData) {
            const statisticData: DisplayStatisticData[] = props.statisticData;

            setPcrEnabled(props.pcrEnabled);
            setStatisticRows(statisticData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.statisticData])

    return (
        <Table bordered hover>
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th><strong>{t('translation:totalTestCount')}</strong></th>
                    <th><strong>{t('translation:positiveTestCount')}</strong></th>
                    {!pcrEnabled
                        ? <></>
                        : <>
                            <th><strong>{t('translation:pcrTotalTestCount')}</strong></th>
                            <th><strong>{t('translation:pcrPositiveTestCount')}</strong></th>
                        </>
                    }
                </tr>
            </thead>
            <tbody>
            {statisticRows.map((statiscData: DisplayStatisticData, i: number) =>
                <tr key={i}>
                    <td><strong>{statiscData.label}</strong></td>
                    <td>{statiscData.ratTestCount}</td>
                    <td>
                        {statiscData.ratTestCount > 0 ? statiscData.ratPositiveTestCount +
                            ' ( ' + (100 * statiscData.ratPositiveTestCount / statiscData.ratTestCount).toFixed(2) + "% )" : 0}
                    </td>
                    {!pcrEnabled
                        ? <></>
                        : <>
                            <td>{statiscData.pcrTestCount}</td>
                            <td>
                                {statiscData.pcrTestCount > 0 ? statiscData.pcrPositiveTestCount +
                                    ' ( ' + (100 * statiscData.pcrPositiveTestCount / statiscData.pcrTestCount).toFixed(2) + "% )" : 0}
                            </td>
                        </>
                    }
                </tr>
                )}
            </tbody>
        </Table>
    )
}

export default StatisticDataRow;

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
        <Form.Group as={Row} controlId='formDateValidFromToInput' className='mb-0'>
            <Form.Label className='input-label d-flex mb-md-0 align-self-center' column xs='12' sm='3'>
                <strong>
                    {t('translation:addStatisticRow')}
                </strong>
            </Form.Label>

            <Col xs='11' md='8' className='d-flex mb-md-0 align-self-center'>
                <Form.Label className='input-label mb-md-0 mr-2 align-self-center'>
                    {t('translation:timerange')}
                </Form.Label>
                <DatePicker
                    selected={dateValidFrom}
                    onChange={handleDateValidFrom}
                    dateFormat={utils.pickerDateFormat}
                    isClearable
                    placeholderText={t('translation:statisticFrom')}
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
            <Col xs='1' md='1' className='d-flex'>
                <Button
                    className='btn-add align-self-center'
                    size="sm"
                    variant="light"
                    onClick={() => { props.addRow(dateValidFrom, dateValidTo) }}
                    disabled={!dateValidFrom}
                >
                    <img className='mr-2' src={imageAdd} alt="Hinzufügen" />
                </Button>
            </Col>
        </Form.Group>
    )
}


