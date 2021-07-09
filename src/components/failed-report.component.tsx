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
import { Button, Card, Col, Fade, Form, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import DatePicker from 'react-datepicker';
import CwaSpinner from './spinner/spinner.component';
import PagedList from './paged-list.component';

import { useGetPDF, useGetPositiveForTimeRange } from '../api';
import { TestResult } from '../misc/enum';
import CardHeader from './modules/card-header.component';
import AppContext from '../misc/appContext';


const FailedReport = (props: any) => {

    const context = React.useContext(AppContext);
    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(false)
    const [filterComplete, setFilterComplete] = React.useState(false)
    const [startDate, setStartDate] = React.useState<Date | undefined>();
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());
    const [selectedHash, setSelectedHash] = React.useState<string>();
    const [filterTestResult, setFilterTestResult] = React.useState<TestResult>();

    const parentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (context.navigation && context.valueSets)
            setIsInit(true);
    }, [context.navigation, context.valueSets])

    const qtArchive = useGetPositiveForTimeRange(filterTestResult, startDate, endDate);
    const pdf = useGetPDF(selectedHash);

    const handleDateChange = (evt: Date | [Date, Date] | null, change: (date: Date | undefined) => void, hour: number) => {
        let date: Date | undefined;

        if (evt instanceof Date) {
            date = new Date(evt);
            // date = evt;
        }
        else if (evt != null) {
            date = evt[0];
        }

        if (date) {
            date.setHours(hour);
        }

        setFilterTestResult(undefined);
        change(date);

    }
    const handleStartDateChange = (evt: Date | [Date, Date] | null) => {
        handleDateChange(evt, setStartDate, 0);
        handleDateChange(evt, setEndDate, 24);
    }

    React.useEffect(() => {
        if (startDate && endDate)
            setFilterComplete(true)
        else {
            setFilterComplete(false);
            setSelectedHash('');
        }
    }, [startDate, endDate])

    React.useEffect(() => {
        if (selectedHash) {
            setSelectedHash(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterTestResult])


    return (
        !(isInit && context && context.valueSets)
            ? <CwaSpinner />
            : <Fade appear={true} in={true} >
                <Card id='data-card'>
                    <CardHeader title={t('translation:failed-report')} />

                    {/*
    content area
    */}
                    <Card.Body id='data-header' className='qt-frame-card '>
                        {/* date of filter input */}
                        <Form.Group as={Row} className='mb-1'>
                            <Form.Label className='input-label txt-no-wrap' column xs='5' sm='3'>{t('translation:timerange')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Row >
                                    <Col xs='12' sm='12' className='d-flex'>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleStartDateChange}
                                            locale='de'
                                            dateFormat='dd. MM. yyyy'
                                            isClearable
                                            placeholderText={t('translation:from')}
                                            className='qt-input form-control mb-2 mb-sm-0'
                                            wrapperClassName='align-self-center'
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            maxDate={new Date()}
                                            minDate={new Date(1900, 0, 1, 12)}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Group>
                        <hr />
                        <Row>
                            <Form.Label className='input-label txt-no-wrap' column xs='5' sm='3'>{t('translation:filter-record-result')}</Form.Label>

                            <Col xs='7' sm='9' className='d-flex'>
                                <Row>
                                    <Form.Group as={Col} xs='12' sm='6' md='3' className='d-flex mb-0' controlId='filterTestResult-radio1'>
                                        <Form.Check className='d-flex align-self-center'>
                                            <Form.Check.Input
                                                className='rdb-input'
                                                type='radio'
                                                name="filterTestResult-radios"
                                                id="filterTestResult-radio1"
                                                checked={filterTestResult === undefined}
                                                onChange={() => setFilterTestResult(undefined)}
                                            />
                                            <Form.Label className='rdb-label mb-0'>{t('translation:filter-none')}</Form.Label>
                                        </Form.Check>
                                    </Form.Group>
                                    <Form.Group as={Col} xs='12' sm='6' md='3' className='d-flex mb-0' controlId='filterTestResult-radio2'>
                                        <Form.Check className='d-flex align-self-center'>
                                            <Form.Check.Input required
                                                className='rdb-input'
                                                type='radio'
                                                name="filterTestResult-radios"
                                                id="filterTestResult-radio2"
                                                checked={filterTestResult === TestResult.POSITIVE}
                                                onChange={() => setFilterTestResult(TestResult.POSITIVE)}
                                            />
                                            <Form.Label className='rdb-label mb-0'>{t('translation:result-positive')}</Form.Label>
                                        </Form.Check>
                                    </Form.Group>
                                    <Form.Group as={Col} xs='12' sm='6' md='3' className='d-flex mb-0' controlId='filterTestResult-radio3'>
                                        <Form.Check className='d-flex align-self-center'>
                                            <Form.Check.Input
                                                className='rdb-input'
                                                type='radio'
                                                name="filterTestResult-radios"
                                                id="filterTestResult-radio3"
                                                checked={filterTestResult === TestResult.NEGATIVE}
                                                onChange={() => setFilterTestResult(TestResult.NEGATIVE)}
                                            />
                                            <Form.Label className='rdb-label mb-0'>{t('translation:result-negative')}</Form.Label>
                                        </Form.Check>
                                    </Form.Group>
                                    <Form.Group as={Col} xs='12' sm='6' md='3' className='d-flex mb-0' controlId='filterTestResult-radio4'>
                                        <Form.Check className='d-flex align-self-center'>
                                            <Form.Check.Input
                                                className='rdb-input'
                                                type='radio'
                                                name="filterTestResult-radios"
                                                id="filterTestResult-radio4"
                                                checked={filterTestResult === TestResult.INVALID}
                                                onChange={() => setFilterTestResult(TestResult.INVALID)}
                                            />
                                            <Form.Label className='rdb-label mb-0'>{t('translation:result-failed')}</Form.Label>
                                        </Form.Check>
                                    </Form.Group>
                                </Row>
                            </Col>
                        </Row>

                        <hr />


                        {!filterComplete ? <></> :
                            (qtArchive === undefined)
                                ? <CwaSpinner background='inherit' />
                                : <Row className='flex-fill'>
                                    <Col md='3'>
                                        <PagedList data={qtArchive} onSelected={setSelectedHash} />
                                    </Col>
                                    <Col md='9' ref={parentRef}>
                                        {!pdf ? <></> : <>
                                            <iframe title='qt-IFrame' src={pdf} className='qt-IFrame' /></>
                                        }
                                    </Col>
                                </Row>
                        }
                    </Card.Body>

                    {/*
    footer
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

export default FailedReport;