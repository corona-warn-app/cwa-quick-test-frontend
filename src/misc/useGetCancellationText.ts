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
  const [result, setCancellationText] = React.useState(['', '']);

  React.useEffect(() => {
    const cancel = cancellation?.cancellation;

    if (cancel && utils && keycloak) {
      let textkey = '';
      let textOptions = {};

      const cancellationCompletePendingTests = ctx.contextConfig['cancellation-complete-pending-tests'];
      const currentStep = utils.getCancellationStep(cancel, cancellationCompletePendingTests);

      switch (currentStep) {
        case CancellationSteps.CANCELED:
          textkey = `cancellation`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
            cancellationDate: cancel.cancellationDate.toLocaleDateString(),
            recordTestDate: new Date(
              cancel.cancellationDate.getTime() + 60 * 60 * (cancellationCompletePendingTests || 24) * 1000
            ).toLocaleDateString(),
            buttonName: t('translation:record-download'),
          };

          break;

        case CancellationSteps.DOWNLOAD_REQUESTED:
          textkey = `download-requested`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
            cancellationDate: cancel.cancellationDate.toLocaleDateString(),
            recordTestDate: new Date(
              cancel.cancellationDate.getTime() + 60 * 60 * (cancellationCompletePendingTests || 24) * 1000
            ).toLocaleDateString(),
            buttonName: t('translation:record-download'),
          };

          break;

        case CancellationSteps.NO_TEST_RECORD:
          textkey = `no-tests`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
            cancellationDate: cancel.cancellationDate.toLocaleDateString(),
            downloadDate: new Date(cancel.cancellationDate.getTime() + dayInMs * 2).toLocaleDateString(),
            buttonName: t('translation:record-download'),
          };

          break;

        case CancellationSteps.DOWNLOAD_READY:
        case CancellationSteps.DOWNLOADED:
          textkey = `download-ready`;

          textOptions = {
            finalDeletionDate: cancel.finalDeletion.toLocaleDateString(),
            buttonName: t('translation:record-download'),
          };

          break;

        case CancellationSteps.DATA_DELETED:
          textkey = `data-deleted`;
          break;

        default:
          break;
      }

      const isAdmin = utils.hasRole(keycloak, 'c19_quick_test_admin');
      const permissionType = isAdmin ? 'admin' : 'tester';
      const titleKey = `${textkey}-${textType}-${permissionType}-title`;
      const descKey = `${textkey}-${textType}-${permissionType}-description`;

      setCancellationText([t(titleKey, textOptions), t(descKey, textOptions)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancellation?.cancellation, utils, keycloak]);

  return result;
};

export default useGetCancellationText;
