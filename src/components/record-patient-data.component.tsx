/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2022, T-Systems International GmbH
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
import {
  Card,
  Col,
  Collapse,
  Container,
  Fade,
  Form,
  Image,
  Row,
} from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import { useKeycloak } from '@react-keycloak/web';

import sha256 from 'crypto-js/sha256';

import CwaSpinner from './spinner/spinner.component';
import utils from '../misc/utils';

import { useGetUuid } from '../api';
import PersonInputs from './modules/person-data-inputs';
import CardFooter from './modules/card-footer.component';
import CardHeader from './modules/card-header.component';
import { IAddressData, IPersonData } from '../misc/quick-test';
import AddressInputs from './modules/address-inputs';
import {
  FormGroupConsentCkb,
  FormGroupDccConsentRadio,
  FormGroupInlineRadio,
  FormGroupInput,
} from './modules/form-group.component';
import AppContext from '../store/app-context';
import eu_logo from '../assets/images/eu_logo.png';
import useOnUnload from '../misc/useOnUnload';
import { TestType } from '../misc/enum';

const RecordPatientData = (props: any) => {
  const context = React.useContext(AppContext);
  const { t } = useTranslation();

  const { keycloak } = useKeycloak();

  const [isInit, setIsInit] = React.useState(false);
  const [uuIdHash, setUuIdHash] = React.useState('');

  const [isBack, setIsBack] = React.useState(true);
  const isBackRef = React.useRef(isBack);
  isBackRef.current = isBack;

  const [processId, setProcessId] = React.useState('');
  const processIdRef = React.useRef(processId);
  processIdRef.current = processId;

  const [person, setPerson] = React.useState<IPersonData>();
  const [address, setAddress] = React.useState<IAddressData>();

  const [pcrEnabled, setPcrEnabled] = React.useState(false);
  const [testType, setTestType] = React.useState(TestType.RAT);

  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [additionalInfo, setAdditionalInfo] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [dccConsent, setDccConsent] = React.useState(false);
  const [dccNoConsent, setDccNoConsent] = React.useState(false);
  const [persDataInQR, setIncludePersData] = React.useState(false);
  const [privacyAgreement, setPrivacyAgreement] = React.useState(false);
  const [validated, setValidated] = React.useState(false);

  const handleError = (error: any) => {
    let msg = '';

    if (error) {
      msg = error.message;
    }

    if (error && error.message && (error.message as string).includes('412')) {
      msg = t('translation:no-group-error');
    }
    props.setError({
      error: error,
      message: msg,
      onCancel: context.navigation!.toLanding,
    });
  };

  const handleDelete = () => {
    deleteQuicktest(processIdRef.current);
  };
  const [uuid, deleteQuicktest] = useGetUuid(
    props?.quickTest?.uuId,
    undefined,
    handleError
  );
  useOnUnload(() => handleDelete);

  React.useEffect(() => {
    return () => {
      if (isBackRef.current) {
        handleDelete();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (keycloak.idTokenParsed) {
      setPcrEnabled(!!(keycloak.idTokenParsed as any).pcr_enabled);
    }
  }, [keycloak]);

  // set values from props or new uuid on mount
  React.useEffect(() => {
    if (props.quickTest) {
      const p = props.quickTest;

      setConsent(p.processingConsens);
      setIncludePersData(p.includePersData);
      setPrivacyAgreement(p.privacyAgreement);
      setPhoneNumber(p.phoneNumber);
      if (p.emailAddress) {
        setEmailAddress(p.emailAddress);
      }
      if (p.additionalInfo) {
        setAdditionalInfo(p.additionalInfo);
      }
      setDccConsent(p.dccConsent);
      setDccNoConsent(!p.dccConsent);
      setTestType(p.testType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.quickTest]);

  // set hash from uuid
  React.useEffect(() => {
    if (uuid) {
      setUuIdHash(sha256(uuid).toString());
    }
  }, [uuid]);

  // set process id from hash
  React.useEffect(() => {
    setProcessId(utils.shortHash(uuIdHash));
  }, [uuIdHash]);

  // set ready state for spinner
  React.useEffect(() => {
    if (processId && context.navigation && context.valueSets) {
      setIsInit(true);
    }
  }, [processId, context.navigation, context.valueSets]);

  const handleDccConsentChange = (evt: any) => {
    setDccConsent(true);
    setDccNoConsent(false);
  };

  const handleDccNoConsentChange = (evt: any) => {
    setDccConsent(false);
    setDccNoConsent(true);
  };

  const handleConsentChange = (evt: any) => {
    setConsent(!consent);
    setIncludePersData(false);
  };

  const handlePersDataInQRChange = (evt: any) => {
    setIncludePersData(!persDataInQR);
    setConsent(false);
  };

  const handleCancel = () => {
    props.setQuickTest(undefined);
    context.navigation!.toLanding();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    setValidated(true);
    setIsBack(false);

    if (form.checkValidity() && person) {
      props.setQuickTest({
        personData: person,
        addressData: address,
        processingConsens: consent,
        uuId: uuid,
        includePersData: persDataInQR,
        privacyAgreement: privacyAgreement,
        phoneNumber: phoneNumber,
        emailAddress: emailAddress || undefined,
        dccConsent: dccConsent,
        additionalInfo: additionalInfo || undefined,
        testType: testType,
      });
      setTimeout(context.navigation!.toShowRecordPatient, 200);
    }
  };

  return !(isInit && context && context.valueSets) ? (
    <CwaSpinner />
  ) : (
    <Fade appear={true} in={true}>
      <Container className='form-flex p-0 '>
        <Row id='process-row'>
          <span className='font-weight-bold mr-2'>
            {t('translation:process')}
          </span>
          <span>{processId}</span>
        </Row>
        <Card id='data-card'>
          <Form
            className='form-flex'
            onSubmit={handleSubmit}
            validated={validated}
          >
            {/*
                            header with title and id card query
                            */}
            <CardHeader idCard={true} title={t('translation:record-result2')} />

            {/*
                            content area with patient inputs and check box
                            */}
            <Card.Body id='data-body' className='pt-0'>
              {/* dccConsent */}
              <Row className='yellow'>
                <Col className='p-0' xs='5' sm='3'>
                  <Row className='m-0 mb-2'>
                    <Col className='p-0' xs='auto'>
                      <Form.Label className='input-label pl-1'>
                        {t('translation:testZertifikat')}*
                      </Form.Label>
                    </Col>
                    <Col className='p-0 jcc-xs-jcfs-lg ml-lg-2 d-flex'>
                      <Image className='eu-flag' src={eu_logo} />
                    </Col>
                  </Row>
                </Col>
                <Col xs='7' sm='9'>
                  <Row className='m-0'>
                    <Form.Label className='input-label m-0'>
                      {t('translation:dccConsent')}
                    </Form.Label>
                  </Row>
                  <Collapse in={dccConsent}>
                    <Row className='m-0 my-1'>
                      <Form.Label className='input-label text-justify m-0'>
                        <Form.Label className='input-label mb-0 mr-2'>
                          &#xf071;
                        </Form.Label>
                        {t('translation:dccConsent-cwa-only')}
                      </Form.Label>
                    </Row>
                  </Collapse>
                  <Row className='m-0 mb-2'>
                    <FormGroupDccConsentRadio
                      controlId='dccConsent-radio1'
                      name='dccConsent-radios'
                      title={t('translation:ja')}
                      checked={dccConsent}
                      onChange={handleDccConsentChange}
                      required={true}
                    />

                    <FormGroupDccConsentRadio
                      controlId='dccConsent-radio2'
                      name='dccConsent-radios'
                      title={t('translation:nein')}
                      checked={dccNoConsent}
                      onChange={handleDccNoConsentChange}
                      required={true}
                    />
                  </Row>
                </Col>
              </Row>

              <hr />
              {!pcrEnabled ? (
                <></>
              ) : (
                <>
                  <Row>
                    <Form.Label
                      className='input-label txt-no-wrap'
                      column
                      xs='5'
                      sm='3'
                    >
                      {t('translation:test-type') + '*'}
                    </Form.Label>

                    <Col xs='7' sm='9' className='d-flex'>
                      <Row>
                        <FormGroupInlineRadio
                          controlId='test-type1'
                          name='test-type-radios'
                          title={t(`translation:${TestType.RAT}`)}
                          sm='6'
                          checked={testType === TestType.RAT}
                          onChange={() => setTestType(TestType.RAT)}
                        />

                        <FormGroupInlineRadio
                          controlId='test-type2'
                          name='test-type-radios'
                          title={t(`translation:${TestType.PCR}`)}
                          sm='6'
                          checked={testType === TestType.PCR}
                          onChange={() => setTestType(TestType.PCR)}
                          required={true}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <hr />
                </>
              )}

              <PersonInputs
                quickTest={props.quickTest}
                onChange={setPerson}
                dccConsent={dccConsent}
                onDccChanged={setDccConsent}
              />

              <hr />

              {/* address input */}
              <AddressInputs
                quickTest={props.quickTest}
                onChange={setAddress}
              />

              <hr />

              {/* phone number input */}

              <FormGroupInput
                controlId='formPhoneInput'
                title={t('translation:phone-number')}
                value={phoneNumber}
                onChange={(evt: any) => setPhoneNumber(evt.target.value)}
                type='tel'
                required
                pattern={utils.pattern.tel}
                maxLength={79}
              />

              <FormGroupInput
                controlId='formEmailInput'
                title={t('translation:email-address')}
                value={emailAddress}
                onChange={(evt: any) => setEmailAddress(evt.target.value)}
                type='email'
                pattern={utils.pattern.eMail}
                minLength={5}
                maxLength={255}
              />

              <FormGroupInput
                controlId='formAdditionalInfo'
                title={t('translation:additional-info')}
                value={additionalInfo}
                onChange={(evt: any) => setAdditionalInfo(evt.target.value)}
                type='text'
                minLength={1}
                maxLength={250}
                prepend='i'
                tooltip={t('translation:additional-info-tooltip')}
              />

              <hr />
              {/* processing consent check box */}
              <FormGroupConsentCkb
                controlId='formConsentCheckbox'
                title={t('translation:processing-consent-title')}
                accordion={t('translation:processing-consent')}
                onClick={handleConsentChange}
                onChange={handleConsentChange}
                type='radio'
                name='check-radios'
                checked={consent}
                required={dccConsent}
              />
              <FormGroupConsentCkb
                controlId='formKeepPrivateCheckbox'
                title={t('translation:patientdata-exclude-title')}
                accordion={t('translation:patientdata-exclude')}
                onClick={handlePersDataInQRChange}
                onChange={handlePersDataInQRChange}
                type='radio'
                name='check-radios'
                checked={persDataInQR}
                required={dccConsent}
              />
              <FormGroupConsentCkb
                controlId='formDataPrivacyCheckbox'
                title={t('translation:data-privacy-approve')}
                onChange={(evt: any) =>
                  setPrivacyAgreement(evt.currentTarget.checked)
                }
                type='checkbox'
                checked={privacyAgreement}
                required
              />
            </Card.Body>

            {/*
    footer with clear and nex button
    */}
            <CardFooter handleCancel={handleCancel} />
          </Form>
        </Card>
      </Container>
    </Fade>
  );
};

export default RecordPatientData;
