import React from 'react';
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route } from 'react-router-dom'
import './i18n';
import { useTranslation } from 'react-i18next';
import Footer from './components/footer.component';
import Header from './components/header.component';
import LandingPage from './components/landing-page.component';
import PrivateRoute from './components/private-route.component';
import { useKeycloak } from '@react-keycloak/web';
import useRoutes from './misc/routes';
import RecordPatientData from './components/record-patient-data';

const Root = (props: any) => {

    const routes = useRoutes();
    const { t } = useTranslation();

    document.title = t('translation:title');

    return (
        <BrowserRouter>

            {/* every time shown */}
            <Route path={routes.root}>
                <Header />
            </Route>

            <Container id='qt-body'>

                {/* Landing */}
                <Route exact path={routes.landing}>
                    <LandingPage />
                </Route>

                {/* Record Patient Data */}
                {/* <Route exact path={routes.recordPatient}>
                    <LandingPage />
                </Route> */}
                <PrivateRoute roles={['test111']} path={routes.recordPatient} component={ RecordPatientData } />

                {/* Show Patient Data */}
                <Route path={routes.showPatientRecord}>
                    {/* <ShowPatientRecord /> */}
                    <LandingPage />
                </Route>

                {/* Record Test Result */}
                <Route path={routes.recordTestResult}>
                    {/* <RecordResult /> */}
                    <LandingPage />
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

            {/* every time shown */}
            <Route path={routes.root}>
                <Footer />
            </Route>

        </BrowserRouter >
    )
}

export default Root;