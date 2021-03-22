import React from 'react';
import { Button, Card } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom'
import useNavigation from '../misc/navigation';

const LandingPage = (props: any) => {
    const navigation = useNavigation();

    return (
        <Card className='h-100 p-3 border-0'>
            <Card.Body className='d-flex flex-column'>
                <Button className='m-2' variant='secondary' onClick={navigation.toLanding}>toLanding</Button>
                <Button className='m-2' variant='secondary' onClick={navigation.toRecordPatient}>toRecordPatient</Button>
                <Button className='m-2' variant='secondary' onClick={navigation.toShowRecordPatient}>toShowRecordPatient</Button>
                <Button className='m-2' variant='secondary' onClick={navigation.toRecordTestResult}>toRecordTestResult</Button>
                <Button className='m-2' variant='secondary' onClick={navigation.toQRScan}>toQRScan</Button>
                <Button className='m-2' variant='secondary' onClick={navigation.toQRDataShow}>toQRDataShow</Button>
            </Card.Body>
        </Card>
    )
}

export default LandingPage;