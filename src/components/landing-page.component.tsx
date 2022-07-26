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
import { Button, Container, Fade } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import CwaSpinner from './spinner/spinner.component';
import { useKeycloak } from '@react-keycloak/web';
import DisclamerButton from './modules/disclamer-btn.component';
import AppContext from '../store/app-context';
import useLocalStorage from '../misc/useLocalStorage';

const LandingPage = (props: any) => {
  const context = React.useContext(AppContext);
  const { t } = useTranslation();

  const { keycloak } = useKeycloak();

  const [isInit, setIsInit] = React.useState(false);
  const [storedLandingDisclaimerShow, setStoredLandingDisclaimerShow] =
    useLocalStorage('landingDisclaimerShow', true);

  const { navigation, utils } = context;

  React.useEffect(() => {
    if (context) {
      setIsInit(true);
    }
  }, [context]);

  return !(isInit && navigation && utils) ? (
    <CwaSpinner />
  ) : (
    <Fade appear={true} in={true}>
      <Container className='center-content'>
        <h1 className='mx-auto mb-5 d-flex'>
          {t('translation:welcome')}
          {utils.hasRole(keycloak, 'c19_quick_test_admin') && (
            <DisclamerButton
              firstTimeShow={props.disclaimerShow}
              checked={!storedLandingDisclaimerShow}
              onInit={() => {
                props.setDisclaimerShow(false);
              }}
              onCheckChange={(checked: boolean) => {
                setStoredLandingDisclaimerShow(!checked);
              }}
              disclaimerText={
                <>
                  {t('translation:disclaimer-text1-part1')}
                  <a href={t('translation:disclaimer-link')} target='blank'>
                    {t('translation:disclaimer-link')}
                  </a>
                  {t('translation:disclaimer-text1-part2')}
                </>
              }
            />
          )}
        </h1>

        {utils.hasRole(keycloak, 'c19_quick_test_counter') ? (
          <Button
            block
            className='landing-btn'
            onClick={navigation.toRecordPatient}
          >
            {t('translation:record-patient-data')}
          </Button>
        ) : (
          <></>
        )}
        {utils.hasRole(keycloak, 'c19_quick_test_lab') ? (
          <Button
            block
            className='landing-btn'
            onClick={navigation.toRecordTestResult}
          >
            {t('translation:record-result')}
          </Button>
        ) : (
          <></>
        )}
        {utils.hasRole(keycloak, 'c19_quick_test_counter') ? (
          <Button block className='landing-btn' onClick={navigation.toQRScan}>
            {t('translation:record-qr-scan')}
          </Button>
        ) : (
          <></>
        )}
        {utils.hasRole(keycloak, 'c19_quick_test_lab') ? (
          <>
            <Button
              block
              className='landing-btn'
              onClick={navigation.toReports}
            >
              {t('translation:failed-report')}
            </Button>
            <Button
              block
              className='landing-btn'
              onClick={navigation.toStatistics}
            >
              {t('translation:statistics-menu-item')}
            </Button>
          </>
        ) : (
          <></>
        )}
        {utils.hasRole(keycloak, 'c19_quick_test_admin') ? (
          <Button
            block
            className='landing-btn'
            onClick={navigation.toUserManagement}
          >
            {t('translation:user-management')}
          </Button>
        ) : (
          <></>
        )}
        {utils.hasRole(keycloak, 'c19_quick_test_admin') ? (
          <Button
            block
            className='landing-btn'
            onClick={navigation.toDataDownload}
          >
            {t('translation:record-download')}
          </Button>
        ) : (
          <></>
        )}
      </Container>
    </Fade>
  );
};

export default LandingPage;
