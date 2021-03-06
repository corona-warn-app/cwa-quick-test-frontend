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
import { Modal, Row, Col, Card, Button, Container, Table } from 'react-bootstrap'

import '../../i18n';
import { useTranslation } from 'react-i18next';


const DataprivacyPage = (props: any) => {

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
                size='lg'
                contentClassName='bg-light'
                scrollable
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
                    <hr className='mx-3 mb-0' />
                <Modal.Body className='px-3 bg-light'>
                    <Container className='px-1 px-sm-2 px-md-3'>
                        <h5 className='text-justify'>
                            Der Schutz Ihrer pers??nlichen Daten hat f??r die T-Systems International GmbH einen hohen Stellenwert. Es ist uns wichtig, Sie dar??ber zu informieren, welche pers??nlichen Daten erfasst werden, wie diese verwendet werden und welche Gestaltungsm??glichkeiten Sie dabei haben.
                    </h5>

                        <ol>
                            <li className='text-justify py-3'>
                                <strong>Welche Daten werden erfasst, wie werden sie verwendet und wie lange werden sie gespeichert?</strong>
                                <ol type='a' className='pr-2 pr-md-4'>
                                    <li>
                                        <strong>Technische Merkmale:</strong> <br />
                                        Wenn Sie sich an unserem Schnelltestportal anmelden, verzeichnet der Server Ihren Benutzernamen, die Teststellen-ID, den verwendeten Mandanten (und die von Ihnen ausgef??hrten Datenbankoperationen (z.B. Eingabe von Patientendaten, Eingabe von Testergebnissen). 
Die protokollierten Daten werden ausschlie??lich f??r Zwecke der Datensicherheit, insbesondere zur Abwehr von Angriffsversuchen auf unseren Server verwendet (Art. 6 Abs. 1f DSGVO). Sie werden weder f??r die Erstellung von individuellen Anwenderprofilen verwendet noch an Dritte weitergegeben und werden nach Ablauf eines Zeitraums von 7 Tagen bis 30 Tagen gel??scht. Die statistische Auswertung anonymisierter Datens??tze behalten wir uns vor.<br />
                                    </li>
                                    <li className='py-3'>
                                        <strong>Authentifizierungsdaten:</strong> <br />
                                        Wenn Sie sich an unserem Schnelltest-Portal anmelden, werden erfolgreiche und fehlgeschlagene Anmeldeversuche dokumentiert. Diese Dokumentation umfasst den Benutzernamen, Ihren Vor- und Nachnamen, den Zeitpunkt der Anmeldung, die IP-Adresse, von der aus die Anmeldung durchgef??hrt wurde und die Session-Dauer. Rechtsgrundlage dieser Verarbeitung ist ?? 26 Abs. 1 BDSG, soweit Sie als Besch??ftigter eines Unternehmens, welches unsere Leistungen in Anspruch nimmt, t??tig sind. Sind Sie auf selbst??ndiger Basis f??r ein Unternehmen t??tig, welches unsere Leistungen in Anspruch nimmt, erfolgt die Verarbeitung auf Grund der durch Ihren Auftraggeber eingeholten Einwilligung zur Speicherung.<br />
                                    </li>
                                    <li>
                                        <strong>Archivierung von Testergebnissen:</strong> <br />
                                        Ihr Benutzername wird zusammen mit den Patientendaten des durchgef??hrten Tests (Name, Vorname, Geburtsdatum, Geschlecht, Adresse, Testhersteller, eingesetzter Test, Tag des Testergebnisses) und dem Testergebnis gem???? gesetzlicher Grundlage archiviert und 10 Jahre aufbewahrt und dann gel??scht.<br />
                                    </li>
                                </ol>
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Wird mein Nutzungsverhalten ausgewertet, z. B. f??r Werbung oder Tracking?<br /></strong>
                                Es werden nur f??r die Nutzung des Schnelltest-Portals erforderliche Cookies verwendet. Diese Cookies sind notwendig, damit Sie durch die Seiten navigieren und wesentliche Funktionen nutzen k??nnen. Sie erm??glichen die Benutzung des Schnelltestportals. Rechtsgrundlage f??r diese Cookies ist Art. 6 Abs. 1b DSGVO bzw. bei Drittstaaten Art. 49 Abs. 1b DSGVO.
                             
                            </li>
                            <Table className='my-3'>
                                <thead>
                                    <tr>
                                        <th>Firma</th>
                                        <th>Zweck</th>
                                        <th>Speicherdauer</th>
                                        <th>Land der Verarbeitung</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>T-Systems</td>
                                        <td>Login</td>
                                        <td>Session Cookie</td>
                                        <td>Deutschland</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <li className='text-justify py-3' >
                                <strong>Wo finde ich die Informationen, die f??r mich wichtig sind?</strong><br />
                                Dieser <strong>Datenschutzhinweis</strong> gibt einen ??berblick ??ber die Punkte, die f??r die Verarbeitung Ihrer Daten in diesem Webportal durch T-Systems gelten.<br />
Weitere Informationen, auch zum Datenschutz im allgemeinen und in speziellen Produkten, erhalten Sie auf <a href='https://www.telekom.com/de/verantwortung/datenschutz-und-datensicherheit/datenschutz'>https://www.telekom.com/de/verantwortung/datenschutz-und-datensicherheit/datenschutz</a> und unter <a href='http://www.telekom.de/datenschutzhinweise'>http://www.telekom.de/datenschutzhinweise</a>.
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Wer ist verantwortlich f??r die Datenverarbeitung? Wer ist mein Ansprechpartner, wenn ich Fragen zum Datenschutz bei der Telekom habe?</strong><br />
                                Datenverantwortliche ist die T-Systems International GmbH. Bei Fragen k??nnen Sie sich an unseren <a href='http://www.telekom.de/kontakt'>Kundenservice</a> wenden oder an unseren Datenschutzbeauftragten, Herrn Dr. Claus D. Ulmer, Friedrich-Ebert-Allee 140, 53113 Bonn, <a href='mailto:datenschutz@telekom.de'>datenschutz@telekom.de</a>.
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Welche Rechte habe ich? </strong><br />
                                Sie haben das Recht,
                                <ol type='a' className='pr-2 pr-md-4'>
                                    <li>
                                        <strong>Auskunft</strong> zu verlangen zu Kategorien der verarbeiteten Daten, Verarbeitungszwecken, etwaigen Empf??ngern der Daten, der geplanten Speicherdauer (Art. 15 DSGVO);
                                    </li>
                                    <li>
                                        die <strong>Berichtigung</strong> bzw. Erg??nzung unrichtiger bzw. unvollst??ndiger Daten zu verlangen (Art. 16 DSGVO);
                                    </li>
                                    <li>
                                        eine erteilte Einwilligung jederzeit mit Wirkung f??r die Zukunft zu <strong>widerrufen</strong> (Art. 7 Abs. 3 DSGVO);
                                    </li>
                                    <li>
                                        einer Datenverarbeitung, die aufgrund eines berechtigten Interesses erfolgen soll, aus Gr??nden zu <strong>widersprechen</strong>, die sich aus Ihrer besonderen Situation ergeben (Art 21 Abs. 1 DSGVO);
                                    </li>
                                    <li>
                                        in bestimmten F??llen im Rahmen des Art. 17 DSGVO die <strong>L??schung</strong> von Daten zu verlangen - insbesondere soweit die Daten f??r den vorgesehenen Zweck nicht mehr erforderlich sind bzw. unrechtm????ig verarbeitet werden, oder Sie Ihre Einwilligung gem???? oben (c) widerrufen oder einen Widerspruch gem???? oben (d) erkl??rt haben;
                                    </li>
                                    <li>
                                        unter bestimmten Voraussetzungen die <strong>Einschr??nkung</strong> von Daten zu verlangen, soweit eine L??schung nicht m??glich bzw. die L??schpflicht streitig ist (Art. 18 DSGVO);
                                    </li>
                                    <li>
                                        auf <strong>Daten??bertragbarkeit</strong>, d.h. Sie k??nnen Ihre Daten, die Sie uns bereitgestellt haben, in einem g??ngigen maschinenlesbaren Format, wie z.B. CSV, erhalten und ggf. an andere ??bermitteln (Art. 20 DSGVO);
                                    </li>
                                    <li>
                                        sich bei der zust??ndigen <strong>Aufsichtsbeh??rde</strong> ??ber die Datenverarbeitung zu <strong>beschweren</strong> (f??r Telekommunikationsvertr??ge: Bundesbeauftragter f??r den Datenschutz und die Informationsfreiheit; im ??brigen: Landesbeauftragte f??r den Datenschutz und die Informationsfreiheit Nordrhein-Westfalen).
                                    </li>
                                </ol>
                            </li>

                            <li className='text-justify py-3' >
                                <strong>An wen gibt die Telekom meine Daten weiter?</strong><br />
                                <strong>An Auftragsverarbeiter</strong>, das sind Unternehmen, die wir im gesetzlich vorgesehenen Rahmen mit der Verarbeitung von Daten beauftragen, Art. 28 DSGVO (Dienstleister, Erf??llungsgehilfen). Die Telekom bleibt auch in dem Fall weiterhin f??r den Schutz Ihrer Daten verantwortlich. Wir beauftragen Unternehmen insbesondere in folgenden Bereichen: IT, Vertrieb, Marketing, Finanzen, Beratung, Kundenservice, Personalwesen, Logistik, Druck.<br />
                                <strong>Aufgrund gesetzlicher Verpflichtung</strong>: In bestimmten F??llen sind wir gesetzlich verpflichtet, bestimmte Daten an die anfragende staatliche Stelle zu ??bermitteln.
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Wo werden meine Daten verarbeitet?</strong><br />
                                Ihre Daten werden in Deutschland und im europ??ischen Ausland verarbeitet. Findet eine Verarbeitung Ihrer Daten in Ausnahmef??llen auch in L??ndern au??erhalb der Europ??ischen Union (in sog. Drittstaaten) statt, geschieht dies,
                                <ol type='a' className='pr-2 pr-md-4'>
                                    <li>
                                    soweit Sie hierin ausdr??cklich eingewilligt haben (Art. 49 Abs. 1a DSGVO).  (In den meisten L??ndern au??erhalb der EU entspricht das Datenschutzniveau nicht den EU Standards. Dies betrifft insbesondere umfassende ??berwachungs- und Kontrollrechte staatlicher Beh??rden, z.B. in den USA, die in den Datenschutz der europ??ischen B??rgerinnen und B??rger unverh??ltnism????ig eingreifen,
                                    </li>
                                    <li>
                                    oder soweit es f??r unsere Leistungserbringung Ihnen gegen??ber erforderlich ist (Art. 49 Abs. 1b DSGVO),
                                    </li>
                                    <li>
                                    oder soweit es gesetzlich vorgesehen ist (Art. 6 Abs. 1c DSGVO).
                                    </li>
                                </ol>
                                Dar??ber hinaus erfolgt eine Verarbeitung Ihrer Daten in Drittstaaten nur, soweit durch bestimmte Ma??nahmen sichergestellt ist, dass hierf??r ein angemessenes Datenschutzniveau besteht (z.B. Angemessenheitsbeschluss der EU-Kommission oder sog. geeignete Garantien, Art. 44ff. DSGVO).<br/><br/>
                                Stand der Datenschutzhinweise 29.04.2021
                            </li>
                        </ol>
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

export default DataprivacyPage;