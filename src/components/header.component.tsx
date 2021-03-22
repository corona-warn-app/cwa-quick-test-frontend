import React from 'react';
import { Row, Image } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
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
            {/* simple header with logo */}
            <Row id='qt-header'>
                <Image src={C19Logo} onClick={navigation.toLanding} />
                <span className='header-font my-auto mx-1'>{t('translation:title')}</span>
            </Row>

            {/* user icon and user name */}
            <Row id='user-container'>
                <Image src={UserLogo} />
                <span className='my-auto mx-1'>{'{$user-name}'}</span>

            </Row>
        </>
    )
}

export default Header;