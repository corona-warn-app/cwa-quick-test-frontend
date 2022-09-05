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
import { Button, Card, Fade } from 'react-bootstrap';

import '../i18n';
import { useTranslation } from 'react-i18next';

import CwaSpinner from './spinner/spinner.component';
import CardFooter from './modules/card-footer.component';
import CardHeader from './modules/card-header.component';
import AppContext from '../store/app-context';
import useCancallation from '../misc/useCancellation';

const DataDownload = (props: any) => {
  const context = React.useContext(AppContext);
  const { t } = useTranslation();
  const [, , requestDownload, getDownloadLink] = useCancallation();

  const [isInit, setIsInit] = React.useState(false);
  const [downloadLink, setDownloadLink] = React.useState('');

  React.useEffect(() => {
    if (context.navigation && context.valueSets) setIsInit(true);
  }, [context.navigation, context.valueSets]);

  React.useEffect(() => {
    downloadLink && window.open(downloadLink, '_blank');
  }, [downloadLink]);

  const handleCancel = () => {
    context.navigation?.toLanding();
  };

  const handleError = (error: any) => {
    let msg = '';

    if (error) {
      msg = error.message;
    }
    if (error && error.message && (error.message as string).includes('412')) {
      msg = t('translation:no-group-error');
    }
    context.updateError({
      error: error,
      message: msg,
    });
  };

  const handleRequestDownload = () => {
    requestDownload(context.updateCancellation!);
  };

  const handleDownload = () => {
    getDownloadLink(setDownloadLink);
  };

  return (
    <>
      {!(isInit && context) ? (
        <CwaSpinner />
      ) : (
        <Fade appear={true} in={true}>
          <Card id='data-card'>
            <CardHeader title={t('translation:record-download')} />

            <Card.Body id='data-body' className='pt-0'>
              <p>{context.cancellation?.status}</p>
              <p>{JSON.stringify(context.cancellation?.cancellation)}</p>
              <p>{downloadLink}</p>
              <Button onClick={context.updateCancellation}>
                update cancellation
              </Button>
              <Button
                disabled={
                  !!context.cancellation?.cancellation?.downloadRequested
                }
                onClick={handleRequestDownload}
              >
                request download
              </Button>
            </Card.Body>

            <CardFooter
              okText={t('translation:data-download')}
              handleCancel={handleCancel}
              disabled={
                !!!(
                  context.cancellation?.cancellation?.downloadRequested &&
                  context.cancellation?.cancellation?.csvCreated
                )
              }
              handleOk={handleDownload}
            />
          </Card>
        </Fade>
      )}
    </>
  );
};

export default DataDownload;
