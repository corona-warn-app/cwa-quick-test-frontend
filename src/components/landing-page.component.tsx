import React from 'react';
import { Button, Container } from 'react-bootstrap'
import '../i18n';
import { useTranslation } from 'react-i18next';
import useNavigation from '../misc/navigation';
import { useKeycloak } from '@react-keycloak/web';

const LandingPage = (props: any) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const {keycloak, initialized} = useKeycloak();

    // React.useEffect(()=>{
    //     if (!initialized) {
    //         keycloak.i
    //     }
    // },[])

    return (
        <Container className='center-content'>
            <h1 className='mx-auto mb-5'>{t('translation:welcome')}</h1>
            <Button block className='landing-btn' onClick={navigation.toRecordPatient}>{t('translation:record-patient-data')}</Button>
            <Button block className='landing-btn' onClick={navigation.toRecordTestResult}>{t('translation:record-result')}</Button>
            <Button block className='landing-btn' onClick={navigation.toQRScan}>{t('translation:record-qr-scan')}</Button>
        </Container>
    )
}

export default LandingPage;