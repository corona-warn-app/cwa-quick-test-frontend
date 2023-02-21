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

import React from 'react';
import { Button, Card, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';

import '../../i18n';
import { useTranslation } from 'react-i18next';

const ConfirmModal = (props: any) => {
  const { t } = useTranslation();
  const [btnOkDisabled, setBtnOkDisabled] = React.useState(true);

  const handleEnter = () => {
    setBtnOkDisabled(false);
  };

  const handleOk = () => {
    if (props.handleOk) {
      setBtnOkDisabled(true);
      props.handleOk();
    }
  };

  return (
    <Modal
      contentClassName='data-modal'
      show={props.show}
      backdrop='static'
      keyboard={false}
      onEnter={handleEnter}
      centered
    >
      <Modal.Header
        id='data-header'
        className='pb-0'
      >
        <Card.Title
          className='m-0 jcc-xs-jcfs-md'
          as={'h3'}
        >
          {props.title}
        </Card.Title>
      </Modal.Header>
      <Modal.Body className='bg-light'>{props.message}</Modal.Body>
      <Modal.Footer id='data-footer'>
        <Container className='p-0'>
          <Row>
            <Col
              sm='6'
              lg='4'
              className='mb-2 mb-sm-0 p-0 pr-sm-2'
            >
              <Button
                className='p-0'
                block
                variant='outline-primary'
                onClick={props.onCancel}
              >
                {t('translation:cancel')}
              </Button>
            </Col>
            <Col
              sm='6'
              lg='4'
              className='p-0 pl-sm-2'
            >
              <Button
                className='p-0'
                block
                onClick={handleOk}
                disabled={btnOkDisabled}
              >
                {t('translation:ok')}

                <Spinner
                  as='span'
                  className='btn-spinner'
                  animation='border'
                  hidden={!btnOkDisabled}
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
