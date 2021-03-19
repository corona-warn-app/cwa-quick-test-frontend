import React from 'react';
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route } from 'react-router-dom'
import Footer from './components/footer.component';
import Header from './components/header.component';
import LandingPage from './components/landing-page.component';
import useRoutes from './misc/routes';

const Root = (props: any) => {

    const routes = useRoutes();

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
                <Route exact path={routes.recordPatient}>
                    {/* <RecordPatient /> */}
                    <LandingPage />
                </Route>

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