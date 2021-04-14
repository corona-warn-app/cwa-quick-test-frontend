/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2021, T-Systems International GmbH
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
import { BrowserRouter, Route } from 'react-router-dom'
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
import QrScan from './components/qr-scan.component';
import PrivateRoute from './components/private-route.component';
import IError from './misc/error';
import ErrorPage from './components/error-page.component';
import useNavigation from './misc/navigation';

const Routing = (props: any) => {

    const navigation = useNavigation();
    const routes = useRoutes();
    const { t } = useTranslation();
    const [patient, setPatient] = React.useState<Patient>();
    const [error, setError] = React.useState<IError>();
    const [errorShow, setErrorShow] = React.useState(false);

    document.title = t('translation:title');

    React.useEffect(()=>{
        if (error) {
            setErrorShow(true);
        }
    },[error])

    React.useEffect(()=>{
        if (!errorShow) {
            setError(undefined);
        }
    },[errorShow])

    return (
        <BrowserRouter>

            {/*
    header, every time shown. fit its children
    */}
            <Route path={routes.root}>
                <Header />
                <ErrorPage error={error} show={errorShow} onCancel={error?.onCancel} onHide={()=>setErrorShow(false)} />
            </Route>

            {/*
    Content area. fit the rest of screen and children
    */}
            <Container id='qt-body'>

                {/* Landing */}
                <PrivateRoute 
                    exact 
                    roles={['c19_quick_test_counter', 'c19_quick_test_counter']} 
                    path={routes.landing} 
                    component={LandingPage}
                /> 

                {/* Record Patient Data */}
                <PrivateRoute 
                    exact 
                    roles={['c19_quick_test_counter']} 
                    path={routes.recordPatient}
                    component={ RecordPatientData }
                    render={ (props) => <RecordPatientData {...props} setPatient={setPatient} patient={patient} setError={setError} /> }
                />

                {/* Show Patient Data */}
                <PrivateRoute 
                    roles={['c19_quick_test_lab', 'c19_quick_test_counter']}
                    path={routes.showPatientRecord}
                    component={ ShowPatientData }
                    render={ (props) => <ShowPatientData {...props} setPatient={setPatient} patient={patient} setError={setError} /> }
                />
                    
                {/* Record Test Result */}
                <PrivateRoute 
                    roles={['c19_quick_test_lab']}
                    path={routes.recordTestResult}
                    component={ RecordTestResult }
                    render={ (props) => <RecordTestResult {...props} setError={setError} /> }
                />
                    
                {/* QR Scan */}
                <PrivateRoute 
                    exact 
                    path={routes.qrScan}
                    roles={['c19_quick_test_lab']}
                    component={ QrScan }
                    render={ (props) => <QrScan {...props} setPatient={setPatient}/> }
                />

                {/* Show QR Scan Data */}
                <PrivateRoute 
                    roles={['c19_quick_test_lab']}
                    path={routes.qrDataShow}
                    component={ LandingPage }
                />

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