import React from "react";
import { Card, Row, Col } from "react-bootstrap";

import '../../i18n';
import { useTranslation } from 'react-i18next';
import DisclamerButton from "./disclamer-btn.component";

const CardHeader = (props: any) => {

    const { t } = useTranslation();

    return (!props ? <></> :
        <Card.Header id='data-header' className='px-3 pt-3 pb-0'>
            <Row>
                <Col md='6' className='px-3'>
                    <Card.Title className='m-md-0 tac-xs-tal-md jcc-xs-jcfs-md' as={'h2'} >{props.title}
                        {props.disclaimerText
                            ? <DisclamerButton
                                firstTimeShow={props.firstTimeShow}
                                checked={props.checked}
                                onInit={props.onInit}
                                onCheckChange={props.onCheckChange}
                                disclaimerText={props.disclaimerText}
                            />
                            : <></>}
                    </Card.Title>
                </Col>
                {!props.idCard
                    ? <></>
                    :
                    <Col md='6' className='d-flex pl-md-0 jcc-xs-jcfe-md'>
                        <Card.Text id='id-query-text'>{t('translation:query-id-card')}</Card.Text>
                    </Col>
                }
            </Row>
            <hr />
        </Card.Header>
    )

}

export default CardHeader;