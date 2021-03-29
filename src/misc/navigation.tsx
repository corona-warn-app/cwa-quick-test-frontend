/*
 * Corona-Warn-App / cwa-log-upload
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
import useRoutes from './routes';

const useNavigation = () => {

    const history = useHistory();
    const routes = useRoutes();
    
    const _toLanding = () => { history.push(routes.landing); }
    const _toRecordPatient = () => { history.push(routes.recordPatient); }
    const _toShowRecordPatient = () => { history.push(routes.showPatientRecord); }
    const _toRecordTestResult = () => { history.push(routes.recordTestResult); }
    const _toQRScan = () => { history.push(routes.qrScan); }
    const _toQRDataShow = () => { history.push(routes.qrDataShow); }

    const navigation = {
        routes: routes,
        toLanding: _toLanding,
        toRecordPatient: _toRecordPatient,
        toShowRecordPatient: _toShowRecordPatient,
        toRecordTestResult: _toRecordTestResult,
        toQRScan: _toQRScan,
        toQRDataShow: _toQRDataShow,
    }

    return navigation;

}

export default useNavigation;