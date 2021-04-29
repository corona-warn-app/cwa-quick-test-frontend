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
import { Modal, Row, Col, Card, Button, Container, Table } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';


const DataprivacyPage = (props: any) => {

    const { t } = useTranslation();
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        if (props)
            setShow(props.show);
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
                            Der Schutz Ihrer persönlichen Daten hat für die T-Systems International GmbH einen hohen Stellenwert. Es ist uns wichtig, Sie darüber zu informieren, welche persönlichen Daten erfasst werden, wie diese verwendet werden und welche Gestaltungsmöglichkeiten Sie dabei haben.
                    </h5>

                        <ol>
                            <li className='text-justify py-3'>
                                <strong>Welche Daten werden erfasst, wie werden sie verwendet und wie lange werden sie gespeichert?</strong>
                                <ol type='a' className='pr-2 pr-md-4'>
                                    <li>
                                        <strong>Technische Merkmale:</strong> <br />
                                        Wenn Sie sich an unserem Schnelltestportal anmelden, verzeichnet der Server Ihren Benutzernamen, die Teststellen-ID, den verwendeten Mandanten (und die von Ihnen ausgeführten Datenbankoperationen (z.B. Eingabe von Patientendaten, Eingabe von Testergebnissen). 
Die protokollierten Daten werden ausschließlich für Zwecke der Datensicherheit, insbesondere zur Abwehr von Angriffsversuchen auf unseren Server verwendet (Art. 6 Abs. 1f DSGVO). Sie werden weder für die Erstellung von individuellen Anwenderprofilen verwendet noch an Dritte weitergegeben und werden nach Ablauf eines Zeitraums von 7 Tagen bis 30 Tagen gelöscht. Die statistische Auswertung anonymisierter Datensätze behalten wir uns vor.<br />
                                    </li>
                                    <li className='py-3'>
                                        <strong>Authentifizierungsdaten:</strong> <br />
                                        Wenn Sie sich an unserem Schnelltest-Portal anmelden, werden erfolgreiche und fehlgeschlagene Anmeldeversuche dokumentiert. Diese Dokumentation umfasst den Benutzernamen, Ihren Vor- und Nachnamen, den Zeitpunkt der Anmeldung, die IP-Adresse, von der aus die Anmeldung durchgeführt wurde und die Session-Dauer. Rechtsgrundlage dieser Verarbeitung ist § 26 Abs. 1 BDSG, soweit Sie als Beschäftigter eines Unternehmens, welches unsere Leistungen in Anspruch nimmt, tätig sind. Sind Sie auf selbständiger Basis für ein Unternehmen tätig, welches unsere Leistungen in Anspruch nimmt, erfolgt die Verarbeitung auf Grund der durch Ihren Auftraggeber eingeholten Einwilligung zur Speicherung.<br />
                                    </li>
                                    <li>
                                        <strong>Archivierung von Testergebnissen:</strong> <br />
                                        Ihr Benutzername wird zusammen mit den Patientendaten des durchgeführten Tests (Name, Vorname, Geburtsdatum, Geschlecht, Adresse, Testhersteller, eingesetzter Test, Tag des Testergebnisses) und dem Testergebnis gemäß gesetzlicher Grundlage archiviert und 10 Jahre aufbewahrt und dann gelöscht.<br />
                                    </li>
                                </ol>
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Wird mein Nutzungsverhalten ausgewertet, z. B. für Werbung oder Tracking?<br /></strong>
                                Es werden nur für die Nutzung des Schnelltest-Portals erforderliche Cookies verwendet. Diese Cookies sind notwendig, damit Sie durch die Seiten navigieren und wesentliche Funktionen nutzen können. Sie ermöglichen die Benutzung des Schnelltestportals. Rechtsgrundlage für diese Cookies ist Art. 6 Abs. 1b DSGVO bzw. bei Drittstaaten Art. 49 Abs. 1b DSGVO.
                             
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
                                <strong>Wo finde ich die Informationen, die für mich wichtig sind?</strong><br />
                                Dieser <strong>Datenschutzhinweis</strong> gibt einen Überblick über die Punkte, die für die Verarbeitung Ihrer Daten in diesem Webportal durch T-Systems gelten.<br />
Weitere Informationen, auch zum Datenschutz im allgemeinen und in speziellen Produkten, erhalten Sie auf <a href='https://www.telekom.com/de/verantwortung/datenschutz-und-datensicherheit/datenschutz'>https://www.telekom.com/de/verantwortung/datenschutz-und-datensicherheit/datenschutz</a> und unter <a href='http://www.telekom.de/datenschutzhinweise'>http://www.telekom.de/datenschutzhinweise</a>.
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Wer ist verantwortlich für die Datenverarbeitung? Wer ist mein Ansprechpartner, wenn ich Fragen zum Datenschutz bei der Telekom habe?</strong><br />
                                Datenverantwortliche ist die T-Systems International GmbH. Bei Fragen können Sie sich an unseren <a href='http://www.telekom.de/kontakt'>Kundenservice</a> wenden oder an unseren Datenschutzbeauftragten, Herrn Dr. Claus D. Ulmer, Friedrich-Ebert-Allee 140, 53113 Bonn, <a href='mailto:datenschutz@telekom.de'>datenschutz@telekom.de</a>.
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Welche Rechte habe ich? </strong><br />
                                Sie haben das Recht,
                                <ol type='a' className='pr-2 pr-md-4'>
                                    <li>
                                        <strong>Auskunft</strong> zu verlangen zu Kategorien der verarbeiteten Daten, Verarbeitungszwecken, etwaigen Empfängern der Daten, der geplanten Speicherdauer (Art. 15 DSGVO);
                                    </li>
                                    <li>
                                        die <strong>Berichtigung</strong> bzw. Ergänzung unrichtiger bzw. unvollständiger Daten zu verlangen (Art. 16 DSGVO);
                                    </li>
                                    <li>
                                        eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu <strong>widerrufen</strong> (Art. 7 Abs. 3 DSGVO);
                                    </li>
                                    <li>
                                        einer Datenverarbeitung, die aufgrund eines berechtigten Interesses erfolgen soll, aus Gründen zu <strong>widersprechen</strong>, die sich aus Ihrer besonderen Situation ergeben (Art 21 Abs. 1 DSGVO);
                                    </li>
                                    <li>
                                        in bestimmten Fällen im Rahmen des Art. 17 DSGVO die <strong>Löschung</strong> von Daten zu verlangen - insbesondere soweit die Daten für den vorgesehenen Zweck nicht mehr erforderlich sind bzw. unrechtmäßig verarbeitet werden, oder Sie Ihre Einwilligung gemäß oben (c) widerrufen oder einen Widerspruch gemäß oben (d) erklärt haben;
                                    </li>
                                    <li>
                                        unter bestimmten Voraussetzungen die <strong>Einschränkung</strong> von Daten zu verlangen, soweit eine Löschung nicht möglich bzw. die Löschpflicht streitig ist (Art. 18 DSGVO);
                                    </li>
                                    <li>
                                        auf <strong>Datenübertragbarkeit</strong>, d.h. Sie können Ihre Daten, die Sie uns bereitgestellt haben, in einem gängigen maschinenlesbaren Format, wie z.B. CSV, erhalten und ggf. an andere übermitteln (Art. 20 DSGVO);
                                    </li>
                                    <li>
                                        sich bei der zuständigen <strong>Aufsichtsbehörde</strong> über die Datenverarbeitung zu <strong>beschweren</strong> (für Telekommunikationsverträge: Bundesbeauftragter für den Datenschutz und die Informationsfreiheit; im Übrigen: Landesbeauftragte für den Datenschutz und die Informationsfreiheit Nordrhein-Westfalen).
                                    </li>
                                </ol>
                            </li>

                            <li className='text-justify py-3' >
                                <strong>An wen gibt die Telekom meine Daten weiter?</strong><br />
                                <strong>An Auftragsverarbeiter</strong>, das sind Unternehmen, die wir im gesetzlich vorgesehenen Rahmen mit der Verarbeitung von Daten beauftragen, Art. 28 DSGVO (Dienstleister, Erfüllungsgehilfen). Die Telekom bleibt auch in dem Fall weiterhin für den Schutz Ihrer Daten verantwortlich. Wir beauftragen Unternehmen insbesondere in folgenden Bereichen: IT, Vertrieb, Marketing, Finanzen, Beratung, Kundenservice, Personalwesen, Logistik, Druck.<br />
                                <strong>Aufgrund gesetzlicher Verpflichtung</strong>: In bestimmten Fällen sind wir gesetzlich verpflichtet, bestimmte Daten an die anfragende staatliche Stelle zu übermitteln.
                            </li>
                            <li className='text-justify py-3' >
                                <strong>Wo werden meine Daten verarbeitet?</strong><br />
                                Ihre Daten werden in Deutschland und im europäischen Ausland verarbeitet. Findet eine Verarbeitung Ihrer Daten in Ausnahmefällen auch in Ländern außerhalb der Europäischen Union (in sog. Drittstaaten) statt, geschieht dies,
                                <ol type='a' className='pr-2 pr-md-4'>
                                    <li>
                                    soweit Sie hierin ausdrücklich eingewilligt haben (Art. 49 Abs. 1a DSGVO).  (In den meisten Ländern außerhalb der EU entspricht das Datenschutzniveau nicht den EU Standards. Dies betrifft insbesondere umfassende Überwachungs- und Kontrollrechte staatlicher Behörden, z.B. in den USA, die in den Datenschutz der europäischen Bürgerinnen und Bürger unverhältnismäßig eingreifen,
                                    </li>
                                    <li>
                                    oder soweit es für unsere Leistungserbringung Ihnen gegenüber erforderlich ist (Art. 49 Abs. 1b DSGVO),
                                    </li>
                                    <li>
                                    oder soweit es gesetzlich vorgesehen ist (Art. 6 Abs. 1c DSGVO).
                                    </li>
                                </ol>
                                Darüber hinaus erfolgt eine Verarbeitung Ihrer Daten in Drittstaaten nur, soweit durch bestimmte Maßnahmen sichergestellt ist, dass hierfür ein angemessenes Datenschutzniveau besteht (z.B. Angemessenheitsbeschluss der EU-Kommission oder sog. geeignete Garantien, Art. 44ff. DSGVO).<br/><br/>
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