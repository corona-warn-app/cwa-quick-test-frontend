import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom'
import QRCode from 'qrcode.react'
import { v4 as uuid } from 'uuid';
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import Patient from '../misc/patient';

const ShowPatientData = (props: any) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [firstName, setFirstName] = React.useState('');
    const [name, setName] = React.useState('');
    const [day, setDay] = React.useState<number>(0);
    const [month, setMonth] = React.useState<number>(0);
    const [year, setYear] = React.useState<number>(0);
    const [consent, setConsent] = React.useState(false);
    const [qrCodeValue, setQrCodeValue] = React.useState('');

    React.useEffect(() => {
        if (props.patient) {
            const p = props.patient;
            setFirstName(p.firstName);
            setName(p.name);
            setDay(1);
            setMonth(1);
            setYear(1);
            setConsent(p.processingConsens);

            setQrCodeValue(uuid());
        }
    }, [])

    return (
        <>
            <Row id='process-row'>
                <span className='font-weight-bold mr-2'>{t('translation:process')}</span>
                <span>{'{$process_nr}'}</span>
            </Row>

            <Card className='border-0 h-100 pb-3'>

                {/*
    content area with patient inputs and check box
    */}
                <Card.Body id='data-header'>
                <Row>
                        <Col sm='6'>
                            <Card.Title className='m-0' as={'h2'} >{t('translation:qr-code')}</Card.Title>
                            <Card.Text className='input-label font-weight-bold mt-4' >{t('translation:patient-data')}</Card.Text>
                            <Card.Text className='input-label' >{firstName + ' ' + name}</Card.Text>
                            <Card.Text className='input-label' >{day + ' ' + month+ ' ' + year}</Card.Text>
                        </Col>
                        <Col className='px-4'>
                        <Container id='qr-code-container'>
                            <QRCode id='qr-code' size={256} renderAs='svg' value={qrCodeValue}/>
                            <Card.Text className='input-label' >{qrCodeValue}</Card.Text>
                        </Container>
                        </Col>
                    </Row>
                </Card.Body>

                {/*
    footer with correction and finish button
    */}
                <Card.Footer id='data-footer'>
                    <Row>
                        <Col xs='6' sm='3'>
                            <Button block onClick={navigation.toRecordPatient} className='my-1 my-sm-0 p-0'>{t('translation:patient-data-correction')}</Button>
                        </Col>
                        <Col xs='6' sm='3' className='pr-sm-0'>
                            <Button block onClick={navigation.toLanding} className='my-1 my-sm-0 p-0'>{t('translation:process-finish')}</Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    )
}

export default ShowPatientData;