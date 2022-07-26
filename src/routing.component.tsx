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
import { Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './i18n';
import { useTranslation } from 'react-i18next';

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
import AppContext from './store/app-context';
import NotificationToast from './components/modals/notification-toast.component';
import useLocalStorage from './misc/useLocalStorage';

const Routing = () => {
  const { t } = useTranslation();
  const context = React.useContext(AppContext);
  const [quickTest, setQuickTest] = React.useState<IQuickTest>();
  const [error, setError] = React.useState<IError>();
  const [errorShow, setErrorShow] = React.useState(false);
  const [notificationShow, setNotificationShow] = React.useState(false);
  const [dataPrivacyShow, setDataPrivacyShow] = React.useState(false);
  const [imprintShow, setImprintShow] = React.useState(false);
  const [storedLandingDisclaimerShow] = useLocalStorage(
    'landingDisclaimerShow',
    true
  );
  const [storedUserManagementDisclaimerShow] = useLocalStorage(
    'userManagementDisclaimerShow',
    true
  );
  const [landingDisclaimerShow, setLandingDisclaimerShow] = React.useState(
    storedLandingDisclaimerShow
  );
  const [userManagementDisclaimerShow, setUserManagementDisclaimerShow] =
    React.useState(storedUserManagementDisclaimerShow);

  document.title = t('translation:title');

  React.useEffect(() => {
    if (error) {
      setErrorShow(true);
    }
  }, [error]);

  const errorOnExit = () => {
    setError(undefined);
  };

  return (
    <>
      {/*
    header, every time shown. fit its children
    */}
      <Route path={context.navigation!.routes.root}>
        <Header />
        <ErrorPage
          error={error}
          show={errorShow}
          onCancel={error?.onCancel}
          onHide={() => setErrorShow(false)}
          onExit={errorOnExit}
        />
        <NotificationToast
          show={notificationShow}
          setNotificationShow={setNotificationShow}
        />
        <DataprivacyPage show={dataPrivacyShow} setShow={setDataPrivacyShow} />
        <ImprintPage show={imprintShow} setShow={setImprintShow} />
      </Route>

      {/*
    Content area. fit the rest of screen and children
    */}
      <Container id='qt-body'>
        {/* Landing */}
        <Route exact path={context.navigation!.routes.landing}>
          <LandingPage
            disclaimerShow={landingDisclaimerShow}
            setDisclaimerShow={(show: boolean) => {
              setLandingDisclaimerShow(show);
            }}
            setNotificationShow={setNotificationShow}
          />
        </Route>

        {/* Record Patient Data */}
        <PrivateRoute
          exact
          roles={['c19_quick_test_counter']}
          path={context.navigation!.routes.recordPatient}
        >
          <RecordPatientData
            setQuickTest={setQuickTest}
            quickTest={quickTest}
            setError={setError}
          />
        </PrivateRoute>

        {/* Show Patient Data */}
        <PrivateRoute
          roles={['c19_quick_test_counter']}
          path={context.navigation!.routes.showPatientRecord}
        >
          <ShowPatientData
            setQuickTest={setQuickTest}
            quickTest={quickTest}
            setError={setError}
            setNotificationShow={setNotificationShow}
          />
        </PrivateRoute>

        {/* Record Test Result */}
        <PrivateRoute
          roles={['c19_quick_test_lab']}
          path={context.navigation!.routes.recordTestResult}
        >
          <RecordTestResult
            setError={setError}
            setNotificationShow={setNotificationShow}
          />
        </PrivateRoute>

        {/* QR Scan */}
        <PrivateRoute
          exact
          path={context.navigation!.routes.qrScan}
          roles={['c19_quick_test_counter']}
        >
          <QrScan setQuickTest={setQuickTest} />
        </PrivateRoute>

        <PrivateRoute
          exact
          path={context.navigation!.routes.statistics}
          roles={['c19_quick_test_counter', 'c19_quick_test_lab']}
        >
          <Statistics setError={setError} />
        </PrivateRoute>

        <PrivateRoute
          exact
          path={context.navigation!.routes.reports}
          roles={['c19_quick_test_counter', 'c19_quick_test_lab']}
        >
          <Reports setError={setError} />
        </PrivateRoute>

        <PrivateRoute
          exact
          path={context.navigation!.routes.userManagement}
          roles={['c19_quick_test_admin']}
        >
          <UserManagement
            setError={setError}
            disclaimerShow={userManagementDisclaimerShow}
            setDisclaimerShow={(show: boolean) => {
              setUserManagementDisclaimerShow(show);
            }}
          />
        </PrivateRoute>
      </Container>

      {/*
    footer, every time shown. fit its children
    */}
      <Route path={context.navigation!.routes.root}>
        <Footer
          setDataPrivacyShow={setDataPrivacyShow}
          setImprintShow={setImprintShow}
        />
      </Route>
    </>
  );
};

export default Routing;
