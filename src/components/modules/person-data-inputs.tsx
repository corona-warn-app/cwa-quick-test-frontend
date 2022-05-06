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
import { Form, Row, Col, Collapse } from "react-bootstrap";

import '../../i18n';
import { useTranslation } from 'react-i18next';
import utils from "../../misc/utils";

import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from 'date-fns/locale/de';

import { Sex } from "../../misc/enum";
import { IPersonData } from "../../misc/quick-test";
import { FormGroupInput, FormGroupInlineRadio } from "./form-group.component";
import useTransliterate from "../../misc/useTransliterate";

registerLocale('de', de)

const PersonInputs = (props: any) => {

    const { t } = useTranslation();
    const [givenNameTransliteration, givenNameTransliterationUpdate] = useTransliterate();
    const [familyNameTransliteration, familyNameTransliterationUpdate] = useTransliterate();

    const [givenName, setGivenName] = React.useState<string>('');
    const [familyName, setFamilyName] = React.useState<string>('');

    const [standardisedGivenName, setStandardisedGivenName] = React.useState<string>('');
    const [standardisedFamilyName, setStandardisedFamilyName] = React.useState<string>('');

    const [dateOfBirth, setDateOfBirth] = React.useState<Date>();
    const [sex, setSex] = React.useState<Sex>();

    React.useEffect(() => {
        if (props && props.quickTest && props.quickTest.personData) {
            const personData = props.quickTest.personData;

            if (personData.givenName) {
                handleGivenNameChanged(personData.givenName);
            }
            if (personData.standardisedGivenName) {
                setStandardisedGivenName(personData.standardisedGivenName);
            }
            if (personData.familyName) {
                handleFamilyNameChanged(personData.familyName);
            }
            setStandardisedFamilyName(personData.standardisedFamilyName);

            if (personData.dateOfBirth) {
                setDateOfBirth(new Date(personData.dateOfBirth));
            }

            if (personData.sex) {
                setSex(personData.sex);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        const result: IPersonData = {
            givenName: givenName,
            familyName: familyName,
            standardisedGivenName: props.dccConsent ? standardisedGivenName : undefined,
            standardisedFamilyName: props.dccConsent ? standardisedFamilyName : undefined,
            dateOfBirth: dateOfBirth,
            sex: sex
        }

        props.onChange(result);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [givenName, familyName, standardisedGivenName, standardisedFamilyName, dateOfBirth, sex, props.dccConsent])

    React.useEffect(() => {
        setStandardisedGivenName(givenNameTransliteration);
    }, [givenNameTransliteration])

    React.useEffect(() => {
        setStandardisedFamilyName(familyNameTransliteration);
    }, [familyNameTransliteration])

    const handleGivenNameChanged = (changedValue: string) => {
        setGivenName(changedValue);

        // convert to ICAO and set the std field
        givenNameTransliterationUpdate(changedValue);
        // setStandardisedName(tmpICAOValue.substring(0, tmpICAOValue.length > 50 ? 50 : tmpICAOValue.length));
    }

    const handleFamilyNameChanged = (changedValue: string) => {
        setFamilyName(changedValue);

        // convert to ICAO and set the std field
        familyNameTransliterationUpdate(changedValue);
        // setStandardisedName(tmpICAOValue.substring(0, tmpICAOValue.length > 50 ? 50 : tmpICAOValue.length));
    }

    const handleStandardisedNameChanged = (changedValue: string, setStandardisedName: (value: string) => void) => {        
        const upperCaseChangedValue = changedValue.toUpperCase();

        if (utils.isStandardisedNameValid(upperCaseChangedValue)) {
            setStandardisedName(upperCaseChangedValue);
        }
    }

    const handleDateOfBirthChange = (evt: Date | [Date, Date] | null) => {
        const date = handleDateChange(evt);
        setDateOfBirth(date);
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
        <>
            {/* first name input */}
            < FormGroupInput controlId='formGivenNameInput' title={t('translation:first-name')}
                value={givenName}
                onChange={(evt: any) => handleGivenNameChanged(evt.target.value)}
                required
                maxLength={50}
            />

            {/* name input */}
            < FormGroupInput controlId='formNameInput' title={t('translation:name')}
                value={familyName}
                onChange={(evt: any) => handleFamilyNameChanged(evt.target.value)}
                required
                maxLength={50}
            />

            <hr />

            <Collapse in={props.dccConsent}>
                <div>
                    {/* standardised first name input */}
                    <FormGroupInput controlId='formStandadisedGivenNameInput' title={t('translation:standardised-first-name')}
                        value={standardisedGivenName}
                        onChange={(evt: any) => handleStandardisedNameChanged(evt.target.value, setStandardisedGivenName)}
                        required={props.dccConsent}
                        pattern={utils.pattern.standardisedName}
                        maxLength={150}
                        prepend='i'
                        tooltip={t('translation:standardised-first-name-tooltip')}
                    />

                    {/*standardised name input */}
                    <FormGroupInput controlId='formStandadisedNameInput' title={t('translation:standardised-name')}
                        value={standardisedFamilyName}
                        onChange={(evt: any) => handleStandardisedNameChanged(evt.target.value, setStandardisedFamilyName)}
                        required={props.dccConsent}
                        pattern={utils.pattern.standardisedName}
                        maxLength={150}
                        prepend='i'
                        tooltip={t('translation:standardised-name-tooltip')}
                    />
                    <hr />
                </div>
            </Collapse>

            {/* date of birth input */}
            <Form.Group as={Row} controlId='formDateOfBirthInput' className='pb-3 mb-0'>
                <Form.Label className='input-label ' column xs='5' sm='3'>{t('translation:date-of-birth') + '*'}</Form.Label>

                <Col xs='7' sm='9' className='d-flex'>
                    <DatePicker
                        selected={dateOfBirth}
                        onChange={handleDateOfBirthChange}
                        locale='de'
                        dateFormat={utils.pickerDateFormat}
                        isClearable
                        placeholderText={t('translation:date-of-birth')}
                        className='qt-input form-control'
                        wrapperClassName='align-self-center'
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                        minDate={new Date(1900, 0, 1, 12)}
                        openToDate={new Date(1990, 0, 1)}
                        required
                    />
                </Col>
            </Form.Group>

            {/* sex input */}
            <Row>
                <Form.Label className='input-label txt-no-wrap' column xs='5' sm='3'>{t('translation:sex') + '*'}</Form.Label>

                <Col xs='7' sm='9' className='d-flex'>
                    <Row>
                        <FormGroupInlineRadio controlId='sex-radio1' name="sex-radios" title={t('translation:male')}
                            checked={sex === Sex.MALE}
                            onChange={() => setSex(Sex.MALE)}
                        />

                        <FormGroupInlineRadio controlId='sex-radio2' name="sex-radios" title={t('translation:female')}
                            checked={sex === Sex.FEMALE}
                            onChange={() => setSex(Sex.FEMALE)}
                            required={true}
                        />

                        <FormGroupInlineRadio controlId='sex-radio3' name="sex-radios" title={t('translation:diverse')}
                            checked={sex === Sex.DIVERSE}
                            onChange={() => setSex(Sex.DIVERSE)}
                        />
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default PersonInputs;