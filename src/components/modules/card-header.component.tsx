/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2023, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the 'License'); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Used character transliteration from
 * https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
 */

import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

import '../../i18n';
import { useTranslation } from 'react-i18next';
import DisclamerButton from './disclamer-btn.component';

const CardHeader = (props: any) => {
  const { t } = useTranslation();

  return !props ? (
    <></>
  ) : (
    <Card.Header
      id='data-header'
      className='px-3 pt-3 pb-0'
    >
      <Row>
        <Col
          md='6'
          className='px-3'
        >
          <Card.Title
            className='m-md-0 tac-xs-tal-md jcc-xs-jcfs-md'
            as={'h2'}
          >
            {props.title}
            {props.disclaimerText ? (
              <DisclamerButton
                firstTimeShow={props.firstTimeShow}
                checked={props.checked}
                onCheckChange={props.onCheckChange}
                disclaimerText={props.disclaimerText}
              />
            ) : (
              <></>
            )}
          </Card.Title>
        </Col>
        {!props.idCard ? (
          <></>
        ) : (
          <Col
            md='6'
            className='d-flex pl-md-0 jcc-xs-jcfe-md'
          >
            <Card.Text id='id-query-text'>{t('translation:query-id-card')}</Card.Text>
          </Col>
        )}
      </Row>
      <hr />
    </Card.Header>
  );
};

export default CardHeader;
