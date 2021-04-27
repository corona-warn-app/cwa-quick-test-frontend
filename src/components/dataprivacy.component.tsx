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
import { Alert, Modal, Image, Row, Col, Card, Button } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import successIcon from '../assets/images/icon_success.svg';


const DataprivacyPage = (props: any) => {

    const { t } = useTranslation();
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        if (props)
            setShow(props.show);
    }, [props.show])

    const handleClose = () => {
        props.setDataPrivacyShow(false)
    }

    return (
        <>
            <Modal
                // dialogClassName='modal-90w'
                size='lg'
                contentClassName=''
                show={show}
                aria-labelledby="example-custom-modal-styling-title"
                centered
                onHide={handleClose}

            >
                <Modal.Header id='data-header' closeButton className='pb-0' >
                    <Row>
                        <Col >
                            <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:dp-title')}</Card.Title>
                        </Col>
                    </Row>
                </Modal.Header>
                <Modal.Body className='py-0 bg-light'>
                    <hr />
                    <h5 className='text-justify'>Der Schutz Ihrer persönlichen Daten hat für die T-Systems International GmbH einen hohen Stellenwert. Es ist uns wichtig, Sie darüber zu informieren, welche persönlichen Daten erfasst werden, wie diese verwendet werden und welche Gestaltungsmöglichkeiten Sie dabei haben.
                    </h5>
                    <ol>
                        <li className='text-justify'><strong>Welche Daten werden erfasst, wie werden sie verwendet und wie lange werden sie gespeichert?</strong>
                    <ol type='a'>
                                <li>
                                    <strong>Technische Merkmale:</strong> Wenn Sie unsere Webseiten besuchen, verzeichnet der Web-Server vorübergehend den Domain-Namen oder die IP- Adresse Ihres Computers, die Dateianfrage des Clients (Dateiname und URL), den http-Antwort-Code und die Webseite, von der aus Sie uns besuchen.
                                    Die protokollierten Daten werden ausschließlich für Zwecke der Datensicherheit, insbesondere zur Abwehr von Angriffsversuchen auf unseren Webserver verwendet (Art. 6 Abs. 1f DSGVO). Sie werden weder für die Erstellung von individuellen Anwenderprofilen verwendet noch an Dritte weitergegeben und werden nach spätestens 7 Tagen gelöscht. Die statistische Auswertung anonymisierter Datensätze behalten wir uns vor.

                        </li>
                            </ol>
                        </li>
                        <span className='font-weight-bold'>{t('translation:serverError')}</span>
                    </ol>
                    <p className='text-center'>
                        <span className='font-weight-bold'>{t('translation:serverError')}</span>
                        <span>{props?.error?.message}</span>
                    </p>

                    <hr />
                </Modal.Body>

                {/*
    footer with ok button
    */}
                <Modal.Footer id='data-footer'>
                    <Button
                        className='py-0'
                        onClick={handleClose}
                    >
                        {t('translation:cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DataprivacyPage;