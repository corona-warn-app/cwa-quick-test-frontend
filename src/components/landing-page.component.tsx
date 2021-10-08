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
import { Button, Container, Fade } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from '../misc/useNavigation';
import CwaSpinner from './spinner/spinner.component';
import { useKeycloak } from '@react-keycloak/web';

const LandingPage = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const { keycloak } = useKeycloak();

    const [isInit, setIsInit] = React.useState(false)

    React.useEffect(() => {
        if (navigation)
            setIsInit(true);
    }, [navigation])

    const hasRole = (role: string) => keycloak && (keycloak.hasRealmRole(role) || keycloak.hasRealmRole(role));

    return (!isInit ? <CwaSpinner /> :
        <Fade appear={true} in={true} >
            <Container className='center-content'>

                <h1 className='mx-auto mb-5'>{t('translation:welcome')}</h1>

                {hasRole('c19_quick_test_counter') ?
                    <Button block className='landing-btn' onClick={navigation!.toRecordPatient}>{t('translation:record-patient-data')}</Button> : null}
                {hasRole('c19_quick_test_lab') ?
                    <Button block className='landing-btn' onClick={navigation!.toRecordTestResult}>{t('translation:record-result')}</Button> : null}
                {hasRole('c19_quick_test_counter') ?
                    <Button block className='landing-btn' onClick={navigation!.toQRScan}>{t('translation:record-qr-scan')}</Button> : null}
                {hasRole('c19_quick_test_lab') ?
                    <><Button block className='landing-btn' onClick={navigation!.toReports}>{t('translation:failed-report')}</Button>
                    <Button block className='landing-btn' onClick={navigation!.toStatistics}>{t('translation:statistics-menu-item')}</Button></> : null}
                {hasRole('c19_quick_test_admin') ?
                    <Button block className='landing-btn' onClick={navigation!.toUserManagement}>{t('translation:user-management')}</Button> : null}
            </Container>
        </Fade>
    )
}

export default LandingPage;