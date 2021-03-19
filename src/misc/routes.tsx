
const useRoutes = () => {

    const result = {
        root: '/',
        landing: '/',
        recordPatient: '/record',
        showPatientRecord: '/record/show',
        recordTestResult: '/record/result',
        qrScan: '/qr/scan',
        qrDataShow: '/qr/scan/show'
    }

    return result;
}

export default useRoutes