import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from '../misc/navigation';
import CwaSpinner from './spinner/spinner.component';

const FailedReport = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isInit, setIsInit] = React.useState(true)


    return (
        !isInit ? <CwaSpinner /> :
            <>
                <Card id='data-card'>
                    <Card.Header id='data-header' className='pb-0'>
                        <Row>
                            <Col md='6'>
                                <Card.Title className='m-0 jcc-xs-jcfs-md' as={'h2'} >{t('translation:failed-report')}</Card.Title>
                            </Col>
                        </Row>
                        <hr />
                    </Card.Header>

                    {/*
    content area
    */}
                    <Card.Body id='data-header'>
                        <Row>
                            TODO Hier kommt noch was.
                        </Row>
                    </Card.Body>

                    {/*
    footer
    */}
                    <Card.Footer id='data-footer'>
                        <Row>
                            <Col sm='6' md='3' className='pr-md-0'>
                                <Button
                                    className='my-1 my-md-0 p-0'
                                    block
                                    onClick={navigation.toLanding}
                                >
                                    {t('translation:cancel')}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </>

    )
}

export default FailedReport;