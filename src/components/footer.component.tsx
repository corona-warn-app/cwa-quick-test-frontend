import React from 'react';
import { Button, Container, Image, Row } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import Routes from '../misc/routes';
import DataProtectLogo from '../assets/images/data_protect.png'

const Footer = (props: any) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <Row id='qt-footer'>
            <span className="my-0 mx-5 footer-font">{t('translation:imprint')}</span>
            <Image className="my-auto" src={DataProtectLogo} />
            <span className="my-0 mx-2 footer-font">{t('translation:data-privacy')}</span>
        </Row>

    )
}

export default Footer;