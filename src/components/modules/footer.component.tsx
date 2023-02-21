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

import { Button, Image, Row } from 'react-bootstrap';

import '../../i18n';
import { useTranslation } from 'react-i18next';

import DataProtectLogo from '../../assets/images/data_protect.png';
import React from 'react';
import DataprivacyPage from '../modals/dataprivacy.component';
import ImprintPage from '../modals/imprint.component';

const Footer = (props: any) => {
  const { t } = useTranslation();
  const [dataPrivacyShow, setDataPrivacyShow] = React.useState(false);
  const [imprintShow, setImprintShow] = React.useState(false);

  const handleDataPrivacyClick = () => {
    setDataPrivacyShow(true);
  };

  const handleImprintClick = () => {
    setImprintShow(true);
  };

  return (
    // simple footer with imprint and data privacy
    <>
      <Row id='qt-footer'>
        <Button
          variant='link'
          className='my-0 p-0 mx-5 footer-font'
          onClick={handleImprintClick}
        >
          {t('translation:imprint')}
        </Button>

        <Image
          className='my-auto'
          src={DataProtectLogo}
        />

        <Button
          variant='link'
          className='my-0 p-0 mx-2 footer-font'
          onClick={handleDataPrivacyClick}
        >
          {t('translation:data-privacy')}
        </Button>
      </Row>

      <DataprivacyPage
        show={dataPrivacyShow}
        setShow={setDataPrivacyShow}
      />
      <ImprintPage
        show={imprintShow}
        setShow={setImprintShow}
      />
    </>
  );
};

export default Footer;
