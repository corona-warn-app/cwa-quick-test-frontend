import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap'
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom'
import useNavigation from '../misc/navigation';
import Routes from '../misc/routes';

const Footer = (props: any) => {
const navigation = useNavigation();

return(<>
    <div id='qt-footer' />
    </>
)
}

export default Footer;