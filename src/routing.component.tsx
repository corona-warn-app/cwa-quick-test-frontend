import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import './i18n';
import { useTranslation } from 'react-i18next';

import useRoutes from './misc/routes';
import Patient from './misc/patient';

import Footer from './components/footer.component';
import Header from './components/header.component';
import LandingPage from './components/landing-page.component';
import RecordPatientData from './components/record-patient-data.component';
import ShowPatientData from './components/show-patient-data.component';
import RecordTestResult from './components/record-test-result.component';

const Routing = (props: any) => {

    const routes = useRoutes();
    const { t } = useTranslation();
    const [patient, setPatient] = React.useState<Patient>();

    document.title = t('translation:title');

    return (
        <BrowserRouter>

            {/*
    header, every time shown. fit its children
    */}
            <Route path={routes.root}>
                <Header />
            </Route>

            {/*
    Content area. fit the rest of screen and children
    */}
            <Container id='qt-body'>

                {/* Landing */}
                <Route exact path={routes.landing}>
                    <LandingPage />
                </Route>

                {/* Record Patient Data */}
                <Route exact path={routes.recordPatient}>
                    <RecordPatientData setPatient={setPatient} patient={patient} />
                </Route>

                {/* Show Patient Data */}
                <Route path={routes.showPatientRecord}>
                    <ShowPatientData patient={patient} />
                </Route>

                {/* Record Test Result */}
                <Route path={routes.recordTestResult}>
                    <RecordTestResult />
                </Route>

                {/* QR Scan */}
                <Route exact path={routes.qrScan}>
                    {/* <QRScan /> */}
                    <LandingPage />
                </Route>

                {/* Show QR Scan Data */}
                <Route path={routes.qrDataShow}>
                    {/* <ShowQRScan /> */}
                    <LandingPage />
                </Route>

            </Container>

            {/*
    footer, every time shown. fit its children
    */}
            <Route path={routes.root}>
                <Footer />
            </Route>

        </BrowserRouter >
    )
}

export default Routing;