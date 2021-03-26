import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import QRCode from 'qrcode.react'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import Patient from '../misc/patient';
import Moment from 'react-moment';
import sha256 from 'crypto-js/sha256';
import 'moment/locale/de';
import CwaSpinner from './spinner/spinner.component';

const ShowPatientData = (props: any) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(false)
    const [patient, setPatient] = React.useState<Patient>();
    const [qrCodeValue, setQrCodeValue] = React.useState('');
    const [uuIdHash, setUuIdHash] = React.useState('');
    const [processId, setProcessId] = React.useState('');

    React.useEffect(() => {
        if (props.patient) {
            setPatient(props.patient)
            setQrCodeValue(JSON.stringify(props.patient));

            setUuIdHash(sha256(props.patient.uuId).toString());
        }
    }, [])

    React.useEffect(() => {
        if (uuIdHash) {
            setProcessId(uuIdHash.substring(0, 6));
        }
    }, [uuIdHash]);

    React.useEffect(() => {
        if (processId) {
            setTimeout(setIsInit, 200, true);
        }
    }, [processId]);

    return (
        !isInit ? <CwaSpinner /> :
            <>
                <Row id='process-row'>
                    <span className='font-weight-bold mr-2'>{t('translation:process')}</span>
                    <span>{processId}</span>
                </Row>

                <Card className='border-0 h-100 pb-3'>

                    {/*
    content area with patient inputs and check box
    */}
                    <Card.Body id='data-header'>
                        <Row>
                            <Col sm='5'>
                                <Card.Title as={'h2'}
                                className='m-sm-0 jcc-xs-jcfs-sm'>{t('translation:qr-code')}</Card.Title>
                                <Card.Text className='input-label font-weight-bold mt-4 jcc-xs-jcfs-sm' >{t('translation:patient-data')}</Card.Text>
                                <Card.Text className='input-label jcc-xs-jcfs-sm mb-0' >{patient?.firstName + ' ' + patient?.name}</Card.Text>
                                <Moment className='input-label mb-3 jcc-xs-jcfs-sm' locale='de' format='DD. MM. yyyy' >{patient?.dateOfBirth as Date}</Moment>

                        {/* <Card.Text className=''>{qrCodeValue.replaceAll(',',', ')}</Card.Text> */}
                            </Col>
                            <Col sm='7' className='px-4'>
                                <Container id='qr-code-container'>
                                    {qrCodeValue ? <><QRCode id='qr-code' size={256} renderAs='svg' value={qrCodeValue} />
                                        {/* <Card.Text className='input-label' >{qrCodeValue}</Card.Text> */}
                                    </> : <></>}
                                </Container>
                            </Col>
                        </Row>
                    </Card.Body>

                    {/*
    footer with correction and finish button
    */}
                    <Card.Footer id='data-footer'>
                        <Row>
                            <Col sm='6' md='4'>
                                <Button block onClick={navigation.toRecordPatient} className='my-1 my-md-0 p-0'>{t('translation:patient-data-correction')}</Button>
                            </Col>
                            <Col sm='6' md='3' className='pr-md-0'>
                                <Button block onClick={navigation.toLanding} className='my-1 my-md-0 p-0'>{t('translation:process-finish')}</Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </>
    )
}

export default ShowPatientData;