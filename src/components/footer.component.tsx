import { Image, Row } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import DataProtectLogo from '../assets/images/data_protect.png'

const Footer = (props: any) => {
    const { t } = useTranslation();

    return (
        // simple footer with imprint and data privacy --> links tbd
        <Row id='qt-footer'>
            <span className="my-0 mx-5 footer-font">{t('translation:imprint')}</span>
            <Image className="my-auto" src={DataProtectLogo} />
            <span className="my-0 mx-2 footer-font">{t('translation:data-privacy')}</span>
        </Row>

    )
}

export default Footer;