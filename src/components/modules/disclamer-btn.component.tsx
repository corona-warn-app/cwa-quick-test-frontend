import React from 'react';
import { Button, Card, Col, Modal, Row, Image, Container } from 'react-bootstrap';

import '../../i18n';
import { Trans, useTranslation } from 'react-i18next';

import SpeechBubbleImage from '../../assets/images/Sprechblase_i.svg';
import { FormGroupConsentCkb } from './form-group.component';


const DisclamerButton = (props: any) => {

    const { t } = useTranslation();
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        setShow(props.firstTimeShow);
        props.onInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Image
                src={SpeechBubbleImage}
                className='speech-bubble'
                onClick={() => { setShow(true) }}
            />

            <Modal
                contentClassName='data-modal'
                show={show}
                backdrop="true"
                onHide={() => { setShow(false) }}
                keyboard={false}
                centered
            >
                <Modal.Header id='data-header' className='pb-0' >
                    <Row>
                        <Col >
                            <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >
                                {t('translation:disclaimer-title')}</Card.Title>
                        </Col>
                    </Row>
                </Modal.Header>

                <Modal.Body className='bg-light py-0'>
                    <hr />
                    <h5 className='disclaimer-text'>
                        <Trans>{props.disclaimerText}</Trans>
                    </h5>

                    <hr />

                    <FormGroupConsentCkb controlId='formDoNotShowCheckbox' title={t('translation:disclaimer-do-not-show')}
                        onChange={(evt: any) => props.onCheckChange(evt.currentTarget.checked)}
                        type='checkbox'
                        checked={props.checked}
                    />
                </Modal.Body>

                <Modal.Footer id='data-footer'>
                    <Container className='p-0'>
                        <Row className='justify-content-end'>
                            <Col xs='6' className='p-0'>
                                <Button
                                    className='py-0'
                                    block
                                    onClick={() => { setShow(false) }}
                                >
                                    {t('translation:ok')}
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DisclamerButton;