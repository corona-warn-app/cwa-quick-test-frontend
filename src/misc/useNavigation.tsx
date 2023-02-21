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
import { useNavigate } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';

export interface IRoute {
  [key: string]: string;
}

export interface INavigation {
  routes: IRoute;
  calculatedRoutes: IRoute;
  toLanding: () => void;
  toRecordPatient: () => void;
  toShowRecordPatient: () => void;
  toRecordTestResult: () => void;
  toQRScan: () => void;
  toStatistics: () => void;
  toReports: () => void;
  toUserManagement: () => void;
}
const basePath = '/';
export const routes = {
  root: basePath,
  landing: basePath,
  recordPatient: basePath + 'record',
  showPatientRecord: basePath + 'record/show',
  recordTestResult: basePath + 'record/result',
  qrScan: basePath + 'qr/scan',
  statistics: basePath + 'statistics',
  reports: basePath + 'reports',
  userManagement: basePath + 'usermanagement',
};

export const useNavigation = () => {
  const nav = useNavigate();
  const [mandant] = useLocalStorage('mandant', '');
  const [calculatedRoutes, setCalculatedRoutes] = React.useState<IRoute>();
  const [result, setResult] = React.useState<INavigation>();

  React.useEffect(() => {
    if (routes) {
      const c = { ...routes };
      const pathMandant = '/' + mandant;

      c.root = pathMandant + routes.root;
      c.landing = pathMandant + routes.landing;
      c.recordPatient = pathMandant + routes.recordPatient;
      c.showPatientRecord = pathMandant + routes.showPatientRecord;
      c.recordTestResult = pathMandant + routes.recordTestResult;
      c.qrScan = pathMandant + routes.qrScan;
      c.statistics = pathMandant + routes.statistics;
      c.reports = pathMandant + routes.reports;
      c.userManagement = pathMandant + routes.userManagement;

      setCalculatedRoutes(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  React.useEffect(() => {
    if (calculatedRoutes && routes) {
      setResult({
        routes: routes,
        calculatedRoutes: calculatedRoutes,

        toLanding: () => {
          nav(calculatedRoutes.landing);
        },
        toRecordPatient: () => {
          nav(calculatedRoutes.recordPatient);
        },
        toShowRecordPatient: () => {
          nav(calculatedRoutes.showPatientRecord);
        },
        toRecordTestResult: () => {
          nav(calculatedRoutes.recordTestResult);
        },
        toQRScan: () => {
          nav(calculatedRoutes.qrScan);
        },
        toStatistics: () => {
          nav(calculatedRoutes.statistics);
        },
        toReports: () => {
          nav(calculatedRoutes.reports);
        },
        toUserManagement: () => {
          nav(calculatedRoutes.userManagement);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatedRoutes]);

  return result;
};

export default useNavigation;
