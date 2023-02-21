/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2023, T-Systems International GmbH
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
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './i18n';
import { useTranslation } from 'react-i18next';

import IQuickTest from './misc/quick-test';

import Footer from './components/modules/footer.component';
import Header from './components/modules/header.component';
import LandingPage from './components/LandingPage/landing-page.component';
import RecordPatientData from './components/record-patient-data.component';
import ShowPatientData from './components/show-patient-data.component';
import RecordTestResult from './components/record-test-result.component';
import QrScan from './components/qr-scan.component';
import Statistics from './components/statistics.component';
import Reports from './components/reports';
import UserManagement from './components/user-management.component';

import PrivateRoute from './components/modules/private-route.component';
import ErrorPage from './components/modals/error-page.component';
import AppContext from './store/app-context';
import NotificationToast from './components/modals/notification-toast.component';
import useLocalStorage from './misc/useLocalStorage';
import useDisabledMandant from './misc/useDisabledMandant';

const Routing = () => {
  const { t } = useTranslation();
  const context = React.useContext(AppContext);
  const [quickTest, setQuickTest] = React.useState<IQuickTest>();
  const [notificationShow, setNotificationShow] = React.useState(false);
  const userManagementRouteIsDisabled = useDisabledMandant();

  document.title = t('translation:title');

  return (
    <>
      {/*
    header, every time shown. fit its children
    */}
      <Header />
      <ErrorPage />
      <NotificationToast
        show={notificationShow}
        setNotificationShow={setNotificationShow}
      />

      {/*
    Content area. fit the rest of screen and children
    */}
      <Container id='qt-body'>
        <Routes>
          {/* Landing */}
          <Route
            path={context.navigation!.routes.landing}
            element={<LandingPage setNotificationShow={setNotificationShow} />}
          />
          {/* Record Patient Data */}
          <Route element={<PrivateRoute roles={['c19_quick_test_counter']} />}>
            <Route
              path={context.navigation!.routes.recordPatient}
              element={
                <RecordPatientData
                  setQuickTest={setQuickTest}
                  quickTest={quickTest}
                />
              }
            />
            <Route
              path={context.navigation!.routes.showPatientRecord}
              element={
                <ShowPatientData
                  setQuickTest={setQuickTest}
                  quickTest={quickTest}
                  setNotificationShow={setNotificationShow}
                />
              }
            />
            <Route
              path={context.navigation!.routes.qrScan}
              element={<QrScan setQuickTest={setQuickTest} />}
            />
            <Route
              path={context.navigation!.routes.statistics}
              element={<Statistics />}
            />

            <Route
              path={context.navigation!.routes.reports}
              element={<Reports />}
            />
          </Route>

          <Route element={<PrivateRoute roles={['c19_quick_test_lab']} />}>
            <Route
              path={context.navigation!.routes.recordTestResult}
              element={<RecordTestResult setNotificationShow={setNotificationShow} />}
            />

            <Route
              path={context.navigation!.routes.statistics}
              element={<Statistics />}
            />

            <Route
              path={context.navigation!.routes.reports}
              element={<Reports />}
            />
          </Route>
          {/* Record Test Result */}
          <Route
            element={
              <PrivateRoute
                roles={['c19_quick_test_admin']}
                disabled={userManagementRouteIsDisabled}
              />
            }
          >
            <Route
              path={context.navigation!.routes.userManagement}
              element={<UserManagement />}
            />
          </Route>
        </Routes>
      </Container>

      {/*
    footer, every time shown. fit its children
    */}
      <Footer />
    </>
  );
};

export default Routing;
