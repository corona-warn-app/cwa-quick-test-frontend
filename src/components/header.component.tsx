import React from 'react';
import { Row, Image, Container, Navbar, NavItem, Nav, NavDropdown } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import C19Logo from '../assets/images/c-19_logo.png'
import UserLogo from '../assets/images/user.png'
import { useKeycloak } from '@react-keycloak/web';

const Header = (props: any) => {
    const location = useLocation();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { keycloak } = useKeycloak();

    const [userName, setUserName] = React.useState('');

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
                    <Navbar.Brand onClick={handleLogout} className='mx-0 dropdown-item'>Logout</Navbar.Brand>
                </NavDropdown>

                <Navbar.Brand className='my-auto mx-0'>{userName}</Navbar.Brand>

            </Navbar>


        </Container >
    )
}

export default Header;