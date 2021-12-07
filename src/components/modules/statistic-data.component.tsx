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
import { Col, Form, Row } from 'react-bootstrap';

import '../../i18n';
import { useTranslation } from 'react-i18next';

import StatisticData from "../../misc/statistic-data";

const StatisticDataRow = (props: any) => {
    const { t } = useTranslation();

    const [label, setLabel] = React.useState<String>('');
    const [totalTestCount, setTotalTestCount] = React.useState<number>(0);
    const [positiveTestCount, setPositiveTestCount] = React.useState<number>(0);
    const [pcrTotalTestCount, setPcrTotalTestCount] = React.useState<number>(0);
    const [pcrPositiveTestCount, setPcrPositiveTestCount] = React.useState<number>(0);

    React.useEffect(() => {
        if (props && props.statisticData) {
            const statisticData: StatisticData = props.statisticData;

            setTotalTestCount(statisticData.totalTestCount);
            setPositiveTestCount(statisticData.positiveTestCount);
            setPcrTotalTestCount(statisticData.pcrTotalTestCount);
            setPcrPositiveTestCount(statisticData.pcrPositiveTestCount);

            setLabel(props.label);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Row>
            <Col xs='12' md='3'>
                <Form.Label className='input-label jcc-xs-jcfs-md mb-md-0'>{t('translation:' + label)}</Form.Label>
            </Col>
            <Col md='9'>
                <Row className='text-center'>
                    <Col xs='6' md='3'>
                        <Row className='text-center row-height-half'>
                            <Col>{t('translation:totalTestCount')}</Col>
                        </Row>
                        <Row className='text-center align-items-end row-height-half'>
                            <Col>{totalTestCount}</Col>
                        </Row>
                    </Col>
                    <Col xs='6' md='3'>
                        <Row className='text-center'>
                            <Col>{t('translation:positiveTestCount')}</Col>
                        </Row>
                        <Row className='text-center'>
                            <Col>{totalTestCount > 0 ? positiveTestCount +
                                ' ( ' + (100 * positiveTestCount / totalTestCount).toFixed(2) + "% )" : undefined}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='6' md='3'>
                        <Row className='text-center row-height-half'>
                            <Col>{t('translation:pcrTotalTestCount')}</Col>
                        </Row>
                        <Row className='text-center align-items-end row-height-half'>
                            <Col>{pcrTotalTestCount}</Col>
                        </Row>
                    </Col>
                    <Col xs='6' md='3'>
                        <Row className='text-center'>
                            <Col>{t('translation:pcrPositiveTestCount')}</Col>
                        </Row>
                        <Row className='text-center'>
                            <Col>{pcrTotalTestCount > 0 ? pcrPositiveTestCount +
                                ' ( ' + (100 * pcrPositiveTestCount / pcrTotalTestCount).toFixed(2) + "% )" : undefined}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default StatisticDataRow;