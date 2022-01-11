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
import { Button, Col, Form, Row, Table, Container } from 'react-bootstrap';

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
        <Table bordered hover responsive className="width-eight-houndred">
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
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {statisticRows.map((statiscData: DisplayStatisticData, i: number) =>
                    <tr key={statiscData.key}>
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
                        <td className="width-one">
                            <Button className="btn-icon delete-icon mx-1"
                                onClick={() => { props.deleteRow(statiscData.key) }}
                            />
                        </td>
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
        <Row className="add-statistic">
            <Col xs='12' md='3' className='pr-0 pl-2'>
                <Form.Label className='input-label' >
                    <strong>
                        {t('translation:addStatisticRow')}
                    </strong>
                </Form.Label>
            </Col>

            <Col xs='12' md='2' className='pr-0 pl-2'>
                <Form.Label className='input-label mr-2'>
                    {t('translation:timerange')}
                </Form.Label>
            </Col>
            <Col xs='12' md='7' className='pl-2 pr-2'>
                <Row>
                    <Col className='add-statistic-item'>
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
                        <Button
                            className='btn-add-statistic-icon ml-auto mr-0 align-self-center'
                            size="sm"
                            variant="light"
                            onClick={() => { props.addRow(dateValidFrom, dateValidTo) }}
                            disabled={!dateValidFrom}
                        >
                            <img src={imageAdd} alt="Hinzufügen" />
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}


