import React from 'react';
import { Button, Container, Navbar, Row, Image } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory, useLocation } from 'react-router-dom'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import C19Logo from '../assets/images/c-19_logo.png'
import UserLogo from '../assets/images/user.png'

const Header = (props: any) => {
    const location = useLocation();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [title, setTitle] = React.useState('');

    React.useEffect(() => {

        setTitle(location.pathname);
    }, [location])

    return (
        <>
            <Row id='qt-header'>
                <Image src={C19Logo} />
                <span className='header-font my-auto mx-1'>{t('translation:title')}</span>
                {/* <h3>{title}</h3> */}
            </Row>
            <Row id='user-container'>
                <Image src={UserLogo} />
                <span className='my-auto mx-1'>{'{$user-name}'}</span>

            </Row>
        </>
    )
}

export default Header;