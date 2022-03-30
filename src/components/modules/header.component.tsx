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
import { Row, Image, Container, Navbar, NavDropdown, Nav } from 'react-bootstrap'

import '../../i18n';
import { Trans, useTranslation } from 'react-i18next';

import { useKeycloak } from '@react-keycloak/web';

import useNavigation from '../../misc/useNavigation';
import C19Logo from '../../assets/images/c-19_logo.png'
import useLocalStorage from '../../misc/useLocalStorage';
import { useHistory } from 'react-router-dom';

const Header = (props: any) => {

    const navigation = useNavigation();
    const history = useHistory();
    const { t } = useTranslation();
    const { keycloak } = useKeycloak();

    const [userName, setUserName] = React.useState('');
    const [isInit, setIsInit] = React.useState(false)

    const [environmentName] = useLocalStorage('environmentName', '');

    React.useEffect(() => {
        if (navigation)
            setIsInit(true);
    }, [navigation])

    // set user name from keycloak
    React.useEffect(() => {

        if (keycloak.idTokenParsed) {
            setUserName((keycloak.idTokenParsed as any).name);
        }

    }, [keycloak])

    const handleLogout = () => {
        keycloak.logout({ redirectUri: window.location.origin + navigation!.calculatedRoutes.landing });
    }

    const changePasswordUrl = keycloak.authServerUrl + 'realms/' + keycloak.realm + '/account/password';

    return (!isInit ? <></> :
        <Container className='position-relative'>
            {/* simple header with logo */}

            {/* user icon and user name */}
            <Row id='qt-header'>
                <Image id='c19-logo' src={C19Logo} />
                <span className='header-font my-auto mx-1 pt-1'>
                    {t('translation:title')}
                    {!environmentName
                        ? <></>
                        : <span className='environment-font my-auto mx-1'>
                            {'\n' + environmentName}
                        </span>
                    }
                </span>
                {!(environmentName && history.location.pathname === navigation?.routes.root)
                    ? <></>
                    : < span className='environment-info-text py-3'>
                        <Trans>
                            {t('translation:environment-info1')}
                            {<a
                                href={t('translation:environment-info-link')}
                                target='blank'
                            >
                                {t('translation:environment-info-link')}
                            </a>}
                            {t('translation:environment-info2')}
                        </Trans>
                    </span>
                }

            </Row>
            {/* {!environmentName
                ? <></>
                : <Row id='qt-environment'>
                    <span className='header-font my-auto mx-1'>
                        {environmentName}
                    </span>
                </Row>
            } */}
            <Navbar id='user-container' >
                <NavDropdown
                    className="nav-dropdown-title"
                    title={userName}
                    id="responsive-navbar-nav"
                >
                    <Nav.Link
                        className='mx-0 dropdown-item'
                        onClick={handleLogout}
                    >
                        {t('translation:logout')}
                    </Nav.Link>
                    <NavDropdown.Divider className='m-0' />
                    <Nav.Link className='mx-0 dropdown-item' href={changePasswordUrl} target='passwordchange'>
                        {t('translation:change-password')}
                    </Nav.Link>
                </NavDropdown>
            </Navbar>
        </Container >
    )
}

export default Header;