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
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import '../i18n';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';

import DatePicker from 'react-datepicker';
import CwaSpinner from './spinner/spinner.component';
import PagedList from './paged-list.component';

import { useGetPDF, useGetPositiveForTimeRange } from '../api';
import useNavigation from '../misc/navigation';
import useOrientationChanged from '../misc/orientation-changed';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';


const FailedReport = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();
    const { keycloak, initialized } = useKeycloak();
    const orientationChanged = useOrientationChanged();

    const [isInit, setIsInit] = React.useState(false)
    const [filterComplete, setFilterComplete] = React.useState(false)
    const [startDate, setStartDate] = React.useState<Date | undefined>();
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());
    const [selectedHash, setSelectedHash] = React.useState<string>();
    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [pageWidth, setPageWidth] = React.useState<number>();
    const [pdfUrl, setPdfUrl] = React.useState<string>();

    const parentRef = React.useRef<HTMLDivElement>(null);

    const history = useHistory();

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
        calcWidth();

        setPdfUrl(window.location.origin + '/api/quicktestarchive/' + selectedHash + '/pdf');
    }

    React.useEffect(() => {
        if (navigation)
            setIsInit(true);
    }, [navigation])

    React.useEffect(() => {
        calcWidth();
    }, [orientationChanged])

    const qtArchive = useGetPositiveForTimeRange(startDate, endDate);
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

        change(date);

    }
    const handleStartDateChange = (evt: Date | [Date, Date] | null) => {
        handleDateChange(evt, setStartDate, 0);
        handleDateChange(evt, setEndDate, 24);
    }

    const handleEndDateChange = (evt: Date | [Date, Date] | null) => {
        handleDateChange(evt, setEndDate, 23);
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
        if (pdf) {
            console.log(pdf);
        }
    }, [pdf])

    const calcWidth = () => {
        // get container
        const container = parentRef.current;

        if (container) {

            const style = window.getComputedStyle(container);

            // calc some width
            var containerWidth =
                container.offsetWidth -
                parseInt(style.paddingLeft, 10) -
                parseInt(style.paddingRight, 10);

            setPageWidth(containerWidth);
        }
    }

    return (
        !isInit ? <CwaSpinner /> :
            <>
                <Card id='data-card'>
                    <Card.Header id='data-header' className='pb-0'>
                        <Row>
                            <Col md='6'>
                                <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:failed-report')}</Card.Title>
                            </Col>
                        </Row>
                        <hr />
                    </Card.Header>

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
                                    {/* <Col className='d-flex'>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={handleEndDateChange}
                                            locale='de'
                                            dateFormat='dd. MM. yyyy'
                                            isClearable
                                            placeholderText={t('translation:to')}
                                            className='qt-input form-control'
                                            wrapperClassName='align-self-center'
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            maxDate={new Date()}
                                            minDate={startDate}
                                            required
                                        />
                                    </Col> */}
                                </Row>
                            </Col>
                        </Form.Group>

                        <hr />

                        {!filterComplete ? <></> :
                            (qtArchive === undefined)
                                ? <CwaSpinner background='inherit' />
                                : <Row className='flex-fill'>
                                    <Col md='3'>
                                        <PagedList data={qtArchive} onSelected={setSelectedHash} />
                                        <hr />
                                    </Col>
                                    <Col md='9' ref={parentRef}>
                                        {selectedHash && <>
                                            {/* <Document
                                                file={{
                                                    url: '/api/quicktestarchive/' + selectedHash + '/pdf',
                                                    httpHeaders: {
                                                        "Authorization": initialized ? `Bearer ${keycloak.token}` : "",
                                                        'Content-Type': 'application/pdf'
                                                    }
                                                }}
                                                renderMode='svg'
                                                onLoadSuccess={onDocumentLoadSuccess}
                                            >
                                                <Page pageNumber={pageNumber} width={pageWidth} />
                                            </Document>
                                            <p>Page {pageNumber} of {numPages}</p> */}

                                            {!pdf ? <></> : <iframe src={pdf} className='qt-IFrame' />}

                                        </>
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
                                    onClick={navigation!.toLanding}
                                >
                                    {t('translation:cancel')}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </>

    )
}

export default FailedReport;