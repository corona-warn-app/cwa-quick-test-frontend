import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppContext from '../store/app-context';
import CancellationSteps from './CancellationSteps';

const dayInMs = 60 * 60 * 24 * 1000;

export enum CancellationTextType {
  LANDING = 'landing',
  DOWNLOAD = 'download',
}

const useGetCancellationText = (textType: CancellationTextType) => {
  const { t } = useTranslation();
  const ctx = React.useContext(AppContext);
  const { keycloak } = useKeycloak();
  const { cancellation, utils } = ctx;
  const [result, setCancellationText] = React.useState('');

  React.useEffect(() => {
    const cancel = cancellation?.cancellation;

    if (cancel && utils && keycloak) {
      let textkey = '';
      let textOptions = {};

      switch (utils.getCancellationStep(cancel)) {
        case CancellationSteps.CANCELED:
          textkey = utils.hasRole(keycloak, 'c19_quick_test_admin')
            ? `cancellation-${textType}-admin-text`
            : `cancellation-${textType}-tester-text`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
            cancellationDate: cancel.cancellationDate.toLocaleDateString(),
            recordPatientDate: new Date(cancel.finalDeletion.getTime() - 7 * dayInMs).toLocaleDateString(),
            recordTestDate: new Date(cancel.finalDeletion.getTime() - dayInMs * 6).toLocaleDateString(),
          };

          break;

        case CancellationSteps.DOWNLOAD_REQUESTED:
          textkey = utils.hasRole(keycloak, 'c19_quick_test_admin')
            ? `download-requested-${textType}-admin-text`
            : `download-requested-${textType}-tester-text`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
            recordTestDate: new Date(cancel.downloadRequested.getTime() + dayInMs * 1).toLocaleDateString(),
          };

          break;

        case CancellationSteps.NO_TEST_RECORD:
          textkey = utils.hasRole(keycloak, 'c19_quick_test_admin')
            ? `no-tests-${textType}-admin-text`
            : `no-tests-${textType}-tester-text`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
          };

          break;

        case CancellationSteps.DOWNLOAD_READY:
        case CancellationSteps.DOWNLOADED:
        case CancellationSteps.DATA_DELETED:
          textkey = utils.hasRole(keycloak, 'c19_quick_test_admin')
            ? `download-ready-${textType}-admin-text`
            : `no-tests-${textType}-tester-text`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
          };

          break;
        default:
          break;
      }

      setCancellationText(t(textkey, textOptions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancellation?.cancellation, utils, keycloak]);

  return result;
};

export default useGetCancellationText;
