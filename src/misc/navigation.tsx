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

import { useHistory } from 'react-router-dom'
import useLocalStorage from './local-storage';
import useRoutes from './routes';

const useNavigation = () => {

    const history = useHistory();
    const routes = useRoutes();
    const [mandant, setMandant] = useLocalStorage('mandant', '');

    const _toLanding = () => { history.push(routes.landing.replace(':mandant', mandant as string)); }
    const _toRecordPatient = () => { history.push(routes.recordPatient.replace(':mandant', mandant as string)); }
    const _toShowRecordPatient = () => { history.push(routes.showPatientRecord.replace(':mandant', mandant as string)); }
    const _toRecordTestResult = () => { history.push(routes.recordTestResult.replace(':mandant', mandant as string)); }
    const _toQRScan = () => { history.push(routes.qrScan.replace(':mandant', mandant as string)); }
    const _toStatistics = () => { history.push(routes.statistics.replace(':mandant', mandant as string)); }
    const _toFailedReport = () => { history.push(routes.failedReport.replace(':mandant', mandant as string)); }

    const navigation = {
        routes: routes,
        toLanding: _toLanding,
        toRecordPatient: _toRecordPatient,
        toShowRecordPatient: _toShowRecordPatient,
        toRecordTestResult: _toRecordTestResult,
        toQRScan: _toQRScan,
        toStatistics: _toStatistics,
        toFailedReport: _toFailedReport,
    }

    return navigation;

}

export default useNavigation;