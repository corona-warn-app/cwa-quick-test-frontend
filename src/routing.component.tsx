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
import { Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import './i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from './misc/useNavigation';
import IQuickTest from './misc/quick-test';

import Footer from './components/modules/footer.component';
import Header from './components/modules/header.component';
import LandingPage from './components/landing-page.component';
import RecordPatientData from './components/record-patient-data.component';
import ShowPatientData from './components/show-patient-data.component';
import RecordTestResult from './components/record-test-result.component';
import QrScan from './components/qr-scan.component';
import Statistics from './components/statistics.component';
import Reports from './components/reports';
import UserManagement from './components/user-management.component';

import PrivateRoute from './components/modules/private-route.component';
import IError from './misc/error';
import ErrorPage from './components/modals/error-page.component';
import DataprivacyPage from './components/modals/dataprivacy.component';
import ImprintPage from './components/modals/imprint.component';
import AppContext, { IAppContext } from './misc/appContext';
import utils from './misc/utils';
import CwaSpinner from './components/spinner/spinner.component';
import { useGetValueSets } from './misc/useValueSet';
import NotificationToast from './components/modals/notification-toast.component';


const Routing = () => {

    const { t } = useTranslation();
    const [quickTest, setQuickTest] = React.useState<IQuickTest>();
    const [error, setError] = React.useState<IError>();
    const [errorShow, setErrorShow] = React.useState(false);
    const [notificationShow, setNotificationShow] = React.useState(false);
    const [dataPrivacyShow, setDataPrivacyShow] = React.useState(false);
    const [imprintShow, setImprintShow] = React.useState(false);
    const [isInit, setIsInit] = React.useState(false);


    const context: IAppContext = {
        navigation: useNavigation(),
        valueSets: useGetValueSets(undefined, (msg) => { setError({ message: msg }) }),
        utils: utils
    }

    document.title = t('translation:title');

    React.useEffect(() => {
        if (error) {
            setErrorShow(true);
        }
    }, [error])

    const errorOnExit = () => {
        setError(undefined);
    }

    React.useEffect(() => {
        if (context.valueSets && Object.entries(context.valueSets).length > 0 && context.navigation)
            setIsInit(true);
    }, [context.navigation, context.valueSets])

    return (
        !(isInit && context.valueSets && context.navigation)
            ? <CwaSpinner />
            : <AppContext.Provider value={context}>
                {/*
    header, every time shown. fit its children
    */}
                <Route path={context.navigation.routes.root}>
                    <Header />
                    <ErrorPage error={error} show={errorShow} onCancel={error?.onCancel} onHide={() => setErrorShow(false)} onExit={errorOnExit} />
                    <NotificationToast show={notificationShow} setNotificationShow={setNotificationShow} />
                    <DataprivacyPage show={dataPrivacyShow} setShow={setDataPrivacyShow} />
                    <ImprintPage show={imprintShow} setShow={setImprintShow} />
                </Route>

                {/*
    Content area. fit the rest of screen and children
    */}
                <Container id='qt-body'>

                    {/* Landing */}
                    <Route
                        exact
                        path={context.navigation.routes.landing}
                    >
                        <LandingPage setNotificationShow={setNotificationShow} />
                    </Route>


                    {/* Record Patient Data */}
                    <PrivateRoute
                        exact
                        roles={['c19_quick_test_counter']}
                        path={context.navigation.routes.recordPatient}
                        component={RecordPatientData}
                        render={(props) => <RecordPatientData {...props} setQuickTest={setQuickTest} quickTest={quickTest} setError={setError} />}
                    />

                    {/* Show Patient Data */}
                    <PrivateRoute
                        roles={['c19_quick_test_counter']}
                        path={context.navigation.routes.showPatientRecord}
                        component={ShowPatientData}
                        render={(props) => <ShowPatientData {...props} setQuickTest={setQuickTest} quickTest={quickTest} setError={setError} setNotificationShow={setNotificationShow} />}
                    />

                    {/* Record Test Result */}
                    <PrivateRoute
                        roles={['c19_quick_test_lab']}
                        path={context.navigation.routes.recordTestResult}
                        component={RecordTestResult}
                        render={(props) => <RecordTestResult {...props} setError={setError} setNotificationShow={setNotificationShow} />}
                    />

                    {/* QR Scan */}
                    <PrivateRoute
                        exact
                        path={context.navigation.routes.qrScan}
                        roles={['c19_quick_test_counter']}
                        component={QrScan}
                        render={(props) => <QrScan {...props} setQuickTest={setQuickTest} />}
                    />

                    <PrivateRoute
                        exact
                        path={context.navigation.routes.statistics}
                        roles={['c19_quick_test_counter', 'c19_quick_test_lab']}
                        component={Statistics}
                        render={(props) => <Statistics {...props} setError={setError} />}
                    />

                    <PrivateRoute
                        exact
                        path={context.navigation.routes.reports}
                        roles={['c19_quick_test_counter', 'c19_quick_test_lab']}
                        component={Reports}
                        render={(props) => <Reports {...props} setError={setError} />}
                    />

                    <PrivateRoute
                        exact
                        path={context.navigation.routes.userManagement}
                        roles={['c19_quick_test_admin']}
                        component={UserManagement}
                        render={(props) => <UserManagement {...props} setError={setError} />}
                    />

                </Container>

                {/*
    footer, every time shown. fit its children
    */}
                <Route path={context.navigation.routes.root}>
                    <Footer setDataPrivacyShow={setDataPrivacyShow} setImprintShow={setImprintShow} />
                </Route>

            </AppContext.Provider>
    )
}

export default Routing;