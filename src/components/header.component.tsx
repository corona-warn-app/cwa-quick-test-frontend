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
        <Container>
            <Navbar id='user-container' >
            {/* simple header with logo */}

            {/* user icon and user name */}
                <div id='qt-header'>
                    <Image src={C19Logo} onClick={navigation.toLanding} />
                    <span className='header-font my-auto mx-1'>{t('translation:title')}</span>
                </div>
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
                    <Navbar.Brand className='my-auto mx-0 '>{userName}</Navbar.Brand>
            </Navbar>
        </Container>
    )
}

export default Header;