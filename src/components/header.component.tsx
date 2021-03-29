import React from 'react';
import { Row, Image, Container, Navbar, NavDropdown } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import { useKeycloak } from '@react-keycloak/web';

import useNavigation from '../misc/navigation';
import C19Logo from '../assets/images/c-19_logo.png'

const Header = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();
    const { keycloak } = useKeycloak();

    const [userName, setUserName] = React.useState('');

    // set user name from keycloak
    React.useEffect(() => {

        if (keycloak.idTokenParsed) {
            setUserName((keycloak.idTokenParsed as any).name);
        }

    }, [keycloak])

    const handleLogout = () => {
        keycloak.logout({ redirectUri: window.location.origin + navigation.routes.landing });
    }

    return (
        <Container className='position-relative'>
            {/* simple header with logo */}
            <Row id='qt-header'>
                <Image src={C19Logo} onClick={navigation.toLanding} />
                <span className='header-font my-auto mx-1'>{t('translation:title')}</span>
            </Row>

            {/* user icon and user name */}
            <Navbar id='user-container' >
                <NavDropdown
                    className="mr-3"
                    title=''
                    id="responsive-navbar-nav"
                >
                    <Navbar.Brand
                        className='mx-0 dropdown-item'
                        onClick={handleLogout}
                    >
                        {t('translation:logout')}
                    </Navbar.Brand>
                </NavDropdown>

                <Navbar.Brand className='my-auto mx-0'>{userName}</Navbar.Brand>
            </Navbar>


        </Container >
    )
}

export default Header;