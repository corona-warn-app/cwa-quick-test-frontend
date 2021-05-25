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
    }, [])

    React.useEffect(() => {
        if (props.onChange) {
            props.onChange({
                zip: zip,
                city: city,
                street: street
            })
        }
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