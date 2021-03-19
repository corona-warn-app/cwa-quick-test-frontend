import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory, useLocation } from 'react-router-dom'
import useNavigation from '../misc/navigation';
import Routes from '../misc/routes';

const Header = (props: any) => {
    const location = useLocation();
    const navigation = useNavigation();

    const [title, setTitle] = React.useState('');

    React.useEffect(() => {

        setTitle(location.pathname);
    }, [location])

    return (<>
        <div id='qt-header'>
            <h3>{title}</h3>
        </div>
    </>
    )
}

export default Header;