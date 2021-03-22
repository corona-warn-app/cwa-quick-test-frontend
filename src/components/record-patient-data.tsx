import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';

const RecordPatientData = (props: any) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <>
            <Row id='process-row'>
                <span className='font-weight-bold mr-2'>{t('translation:process')}</span>
                <span>{'{$process_nr}'}</span>
            </Row>

            <Card className='border-0 h-100 pb-3'>

                <Card.Header id='data-header'>
                    <Row>
                        <Col sm='auto'>
                            <Card.Title as={'h2'} >{t('translation:record-data')}</Card.Title>
                        </Col>
                        <Col >
                            <Card.Text id='id-query-text'>{t('translation:query-id-card')}</Card.Text>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body id='data-body'>
                    <Form>
                        <Form.Group as={Row} controlId="formNameInput">
                            <Form.Label column sm="4">{t('translation:prename')}</Form.Label>

                            <Col sm="8">
                                <Form.Control placeholder={t('translation:prename')} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formNameInput">
                            <Form.Label column sm="4">{t('translation:name')}</Form.Label>

                            <Col sm="8">
                                <Form.Control placeholder={t('translation:name')} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formDateInput">
                            <Form.Label column sm="4">{t('translation:date-of-birth')}</Form.Label>

                            <Col sm="8">
                                <Form.Control placeholder={t('translation:date-of-birth')} />
                            </Col>
                        </Form.Group>
                    </Form>

                </Card.Body>
                <Card.Footer id='data-footer'>
                    <Row className=''>
                        <Button className='mr-4 p-0'>{t('translation:clear')}</Button>
                        <Button className=' p-0'>{t('translation:next')}</Button>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    )
}

export default RecordPatientData;