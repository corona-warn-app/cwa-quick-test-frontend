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


import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import '../../i18n';
import { useTranslation } from 'react-i18next';

import utils from "../../misc/utils";
import { FormGroupAddressInput } from "./form-group.component";


const AddressInputs = (props: any) => {

    const { t } = useTranslation();

    const [zip, setZip] = React.useState('');
    const [city, setCity] = React.useState('');
    const [street, setStreet] = React.useState('');
    // const [houseNumber, setHouseNumber] = React.useState('');

    React.useEffect(() => {
        if (props && props.quickTest && props.quickTest.addressData) {
            const data = props.quickTest.addressData;

            if (data.zip) {
                setZip(data.zip);
            }
            if (data.city) {
                setCity(data.city);
            }
            if (data.street) {
                setStreet(data.street);
            }
            // if (data.houseNumber) {
            //     setHouseNumber(data.houseNumber);
            // }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (props.onChange) {
            props.onChange({
                zip: zip,
                city: city,
                street: street
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zip, city, street])

    return (!props ? <></>
        : <>
            <Row>
                <Form.Label className='input-label' column xs='5' sm='3'>{t('translation:address')+'*'}</Form.Label>

                <Col xs='7' sm='9' className=''>
                    <Row>

                        <FormGroupAddressInput sm='4' className='mb-1' controlId='zipInput' placeholder={t('translation:zip')}
                            value={zip}
                            onChange={(evt: any) => setZip(evt.currentTarget.value)}
                            required
                            pattern={utils.pattern.zip}
                        />
                        <FormGroupAddressInput sm='8' className='my-1 mt-sm-0' controlId='cityInput' placeholder={t('translation:city')}
                            value={city}
                            onChange={(evt: any) => setCity(evt.currentTarget.value)}
                            required
                            maxLength={255}
                        />
                        <FormGroupAddressInput className='my-1 mb-sm-0' controlId='streetInput' placeholder={t('translation:street')}
                            value={street}
                            onChange={(evt: any) => setStreet(evt.currentTarget.value)}
                            required
                            maxLength={255}
                        />
                        {/* <FormGroupAddressInput sm='4' className='mt-1 mb-sm-0' controlId='houseNumberInput' placeholder={t('translation:house-number')}
                            value={houseNumber}
                            onChange={(evt: any) => setHouseNumber(evt.currentTarget.value)}
                            required
                            pattern={utils.pattern.houseNo}
                            maxLength={15}
                        /> */}
                    </Row>
                </Col>
            </Row>
        </>)
}

export default AddressInputs;