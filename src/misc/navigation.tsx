import React from 'react';
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route, useHistory } from 'react-router-dom'
import useRoutes from './routes';

const useNavigation = () => {

    const history = useHistory();
    const routes = useRoutes();
    
    const _toLanding = () => { history.push(routes.landing); }
    const _toRecordPatient = () => { history.push(routes.recordPatient); }
    const _toShowRecordPatient = () => { history.push(routes.showPatientRecord); }
    const _toRecordTestResult = () => { history.push(routes.recordTestResult); }
    const _toQRScan = () => { history.push(routes.qrScan); }
    const _toQRDataShow = () => { history.push(routes.qrDataShow); }

    const navigation = {
        routes: routes,
        toLanding: _toLanding,
        toRecordPatient: _toRecordPatient,
        toShowRecordPatient: _toShowRecordPatient,
        toRecordTestResult: _toRecordTestResult,
        toQRScan: _toQRScan,
        toQRDataShow: _toQRDataShow,
    }

    return navigation;

}

export default useNavigation;