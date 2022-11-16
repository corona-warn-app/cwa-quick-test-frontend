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
import { Container, Fade } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import '../../i18n';

import { useKeycloak } from '@react-keycloak/web';
import AppContext from '../../store/app-context';
import CwaSpinner from '../spinner/spinner.component';
import LandingButton from './LandingButton';
import LandingDisclaimerButton from './LandingDisclaimerButton';
import LandingCancellationText from './LandingCancellationText';
import CancellationSteps from '../../misc/CancellationSteps';
import useCancallation from '../../misc/useCancellation';

const LandingPage = (props: any) => {
  const context = React.useContext(AppContext);
  const { navigation, utils } = context;

  const { t } = useTranslation();
  const { keycloak } = useKeycloak();
  const [, , , getDownloadLink] = useCancallation();

  const [cancellationStep, setCancellationStep] = React.useState<CancellationSteps>(CancellationSteps.NO_CANCEL);
  const [downloadLink, setDownloadLink] = React.useState('');

  React.useEffect(() => {
    context.cancellation?.cancellation &&
      utils &&
      setCancellationStep(
        utils.getCancellationStep(
          context.cancellation.cancellation,
          context.contextConfig['cancellation-complete-pending-tests']
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.cancellation?.cancellation]);

  React.useEffect(() => {
    downloadLink && window.open(downloadLink, '_blank');
  }, [downloadLink]);

  const handleDownload = () => {
    getDownloadLink(setDownloadLink);
  };

  return (
    <>
      {!context && <CwaSpinner />}

      {context && utils && navigation && (
        <Fade appear={true} in={true}>
          <Container className='center-content'>
            <h1 className='mx-auto mb-5 d-flex'>
              {t('translation:welcome')}
              <LandingDisclaimerButton hasRole={utils.hasRole(keycloak, 'c19_quick_test_admin')} />
            </h1>
            <LandingCancellationText />

            <LandingButton
              hasRole={utils.hasRole(keycloak, 'c19_quick_test_counter')}
              title={t('translation:record-patient-data')}
              onClick={navigation.toRecordPatient}
              disabled={cancellationStep >= CancellationSteps.DOWNLOAD_REQUESTED}
            />

            <LandingButton
              hasRole={utils.hasRole(keycloak, 'c19_quick_test_lab')}
              title={t('translation:record-result')}
              onClick={navigation.toRecordTestResult}
              disabled={cancellationStep >= CancellationSteps.NO_TEST_RECORD}
            />

            <LandingButton
              hasRole={utils.hasRole(keycloak, 'c19_quick_test_counter')}
              title={t('translation:record-qr-scan')}
              onClick={navigation.toQRScan}
              disabled={cancellationStep >= CancellationSteps.DOWNLOAD_REQUESTED}
            />

            <LandingButton
              hasRole={utils.hasRole(keycloak, 'c19_quick_test_lab')}
              title={t('translation:failed-report')}
              onClick={navigation.toReports}
            />

            <LandingButton
              hasRole={utils.hasRole(keycloak, 'c19_quick_test_lab')}
              title={t('translation:statistics-menu-item')}
              onClick={navigation.toStatistics}
            />

            <LandingButton
              hasRole={utils.hasRole(keycloak, 'c19_quick_test_admin')}
              title={t('translation:user-management')}
              onClick={navigation.toUserManagement}
            />

            <LandingButton
              hasRole={
                utils.hasRole(keycloak, 'c19_quick_test_admin') && cancellationStep !== CancellationSteps.NO_CANCEL
              }
              title={t('translation:record-download')}
              onClick={handleDownload}
              disabled={
                cancellationStep < CancellationSteps.DOWNLOAD_READY ||
                cancellationStep >= CancellationSteps.DATA_DELETED
              }
            />
          </Container>
        </Fade>
      )}
    </>
  );
};

export default LandingPage;
