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
import { Modal, Row, Col, Card, Button, Container } from 'react-bootstrap'

import '../../i18n';
import { useTranslation } from 'react-i18next';


const ImprintPage = (props: any) => {

    const { t } = useTranslation();
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        if (props)
            setShow(props.show);
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.show])

    const handleClose = () => {
        props.setShow(false)
    }

    return (
        <>
            <Modal
                // dialogClassName='modal-90w'
                size='lg'
                scrollable
                contentClassName='bg-light'
                show={show}
                aria-labelledby="example-custom-modal-styling-title"
                centered
                onHide={handleClose}
            >
                <Modal.Header id='data-header' closeButton className='pb-0' >
                    <Row>
                        <Col >
                            <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:imprint-title')}</Card.Title>
                        </Col>
                    </Row>
                </Modal.Header>
                <hr className='mx-3 mb-0' />
                <Modal.Body className='px-3 bg-light'>

                    <h5 className='text-justify'>
                        T-Systems International GmbH
                    </h5>

                    <Container className='px-1 px-sm-2 px-md-3'>
                        <br />

                        <p>
                            <strong>Adresse:</strong><br />
                            Hahnstraße 43d<br />
                            D-60528 Frankfurt am Main<br />
                            E-Mail: <a href='mailto:info@t-systems.com'>info@t-systems.com</a><br />
                            Telefon: 069 20060 - 0
                        </p>

                        <p>
                            <strong>Handelsregister:</strong><br />
                            Amtsgericht Frankfurt am Main, HRB 55933, Sitz der Gesellschaft: Frankfurt am Main, Deutschland<br />
                            Ust.-IdNr. DE 118 645 675<br />
                            WEEE-Reg.-Nr. DE50335567
                        </p>

                        <p>
                            <strong>Aufsichtsbehörde:</strong><br />
                            Bundesnetzagentur für Elektrizität, Gas, Telekommunikation, Post und Eisenbahnen<br />
                            Tulpenfeld 4, 53113 Bonn
                        </p>

                        <p>
                            <strong>Aufsichtsrat:</strong><br />
                            Dr. Christian P. Illek (Vorsitzender)
                        </p>

                        <p>
                            <strong>Vertretungsberechtigt:</strong><br />
                            Adel Al-Saleh (Vorsitzender), Christoph Ahrendt, François Fleutiaux, Georg Pepping
                        </p>

                        <p>
                            <strong>Verantwortlich:</strong><br />
                            T-Systems International GmbH<br />
                            Katharyn White<br />
                            Senior Vice President und CMO<br />
                            Friedrich-Ebert-Allee-140<br />
                            D – 53113 Bonn
                        </p>

                        <p>
                            <a href='https://www.t-systems.com/de/de/kontakt#_blank' rel='noreferrer' target='_blank'>Kontakt aufnehmen</a>
                        </p>

                    </Container>
                </Modal.Body>
                <hr className='mx-3 mt-0' />
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

export default ImprintPage;


// Verantwortlich: 

// T-Systems International GmbH 

// Katharyn White 

// Senior Vice President und CMO 

// Friedrich-Ebert-Allee-140 

// D – 53113 Bonn 


// Kontakt aufnehmen 

