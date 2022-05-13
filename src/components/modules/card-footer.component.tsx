import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2022, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the 'License'); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 * 
 * Used character transliteration from 
 * https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
 */


import '../../i18n';
import { useTranslation } from 'react-i18next';

const CardFooter = (props: any) => {

    const { t } = useTranslation();

    return (!props ? <></> :
        <Card.Footer id='data-footer'>
            <Row>
                <Col sm='6' md='3' className=''>
                    <Button
                        className='my-1 my-md-0 p-0'
                        variant='outline-primary'
                        block
                        onClick={props.handleCancel}
                    >
                        {props.cancelText
                            ? props.cancelText
                            : t('translation:cancel')}
                    </Button>
                </Col>
                <Col sm='6' md='3' className='pr-md-0'>
                    <Button
                        className='my-1 my-md-0 p-0'
                        block
                        type='submit'
                        onClick={props.handleOk}
                        disabled={props.disabled}
                    >
                        {props.okText
                            ? props.okText
                            :t('translation:next')}
                    </Button>
                </Col>
            </Row>
        </Card.Footer>
    )

}

export default CardFooter;
