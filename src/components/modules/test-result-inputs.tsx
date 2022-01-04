import React from "react";

import '../../i18n';
import { useTranslation } from 'react-i18next';

import { TestResult } from "../../misc/enum";
import { FormGroupInput, FormGroupRadio, FormGroupValueSetSelect } from "./form-group.component";
import useLocalStorage from "../../misc/useLocalStorage";
import ITestResult from "../../misc/test-result";
import { ITests, useGetTests } from "../../api";
import AppContext from "../../misc/appContext";
import { getValueSetDisplay, Value_Sets } from "../../misc/useValueSet";
import { Container, Fade } from "react-bootstrap";


const TestResultInputs = (props: any) => {

    const context = React.useContext(AppContext);
    const { t } = useTranslation();

    const [testResult, setTestResult] = React.useState<TestResult>();

    const [testId, setTestId] = useLocalStorage('testId', '');
    const [testName, setTestName] = useLocalStorage('testName', '');
    const [testManufacturerId, setTestManufacturerId] = useLocalStorage('testManufacturers', '');
    const [testManufacturerDescription, setTestManufacturerDescription] = React.useState('');
    const [dccConsent, setDccConsent] = React.useState<boolean>();

    const tests = useGetTests();

    React.useEffect(() => {
        if (testResult) {
            const result: ITestResult = {
                testBrandId: dccConsent ? undefined : testId,
                testBrandName: dccConsent ? undefined : testName,
                result: testResult,
                dccTestManufacturerId: dccConsent ? testManufacturerId : undefined,
                dccTestManufacturerDescription: dccConsent ? testManufacturerDescription : undefined
            }

            props.onChange(result);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testId, testName, testResult, testManufacturerId, testManufacturerDescription])

    React.useEffect(() => {
        if (testManufacturerId) {
            const desc = getValueSetDisplay(testManufacturerId, context!.valueSets![Value_Sets.TestManufacturer]);
            if (desc) {
                setTestManufacturerDescription(desc);
            }
        }
        else {
            setTestManufacturerDescription('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testManufacturerId])

    React.useEffect(() => {
        if (props.quickTest) {
            setDccConsent(props.quickTest.dccConsent === true);
        }
    }, [props.quickTest])

    const handleTestChange = (evt: any, change: (str: string) => void) => {
        const value = evt.currentTarget.value;

        if (tests && value) {
            const strVal: string = value;
            const splitIndex = strVal.indexOf('-');

            const id = strVal.slice(0, splitIndex - 1);
            const name = strVal.slice(splitIndex + 2);

            const find = tests.find((item) => (strVal.length <= 15 || item.testBrandName === name) && item.testBrandId === id);
            if (find) {
                setTestId(find.testBrandId);
                setTestName(find.testBrandName);
            }
            else {
                change(value)
            }
        }
        else {
            change(value)
        }
    }

    const handleTestIdChange = (evt: any) => {
        handleTestChange(evt, setTestId);
    }
    const handleTestNameChange = (evt: any) => {
        handleTestChange(evt, setTestName);
    }

    const byId = (a: ITests, b: ITests): number => {
        if (a.testBrandId < b.testBrandId) {
            return -1;
        }
        if (a.testBrandId > b.testBrandId) {
            return 1;
        }

        // names must be equal
        return 0;
    }
    const byName = (a: ITests, b: ITests): number => {
        const nameA = a.testBrandName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.testBrandName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    }


    return (
        <Fade appear={true} in={dccConsent !== undefined}>
            <Container className='form-flex p-0 '>
                {/* test-ID input */}
                < FormGroupInput controlId='formTestIdInput' title={t('translation:test-id')}
                    value={testId}
                    onChange={handleTestIdChange}
                    required={!dccConsent}
                    hidden={dccConsent}
                    maxLength={15}
                    datalistId='testid-list'
                    datalist={tests ? tests.sort(byId).map((i: ITests) => <option key={i.testBrandId} value={i.testBrandId + ' - ' + i.testBrandName} />) : undefined}
                />

                {/* <hr hidden={dccConsent} /> */}

                {/* test-name input */}
                < FormGroupInput controlId='formTestNameInput' title={t('translation:test-name')}
                    value={testName}
                    onChange={handleTestNameChange}
                    required={!dccConsent}
                    hidden={dccConsent}
                    maxLength={200}
                    datalistId='testname-list'
                    datalist={tests ? tests.sort(byName).map((i: ITests) => <option key={i.testBrandId} value={i.testBrandId + ' - ' + i.testBrandName} />) : undefined}
                />

                <hr hidden={dccConsent} />

                {/* combobox testManufacturers */}
                <FormGroupValueSetSelect controlId='formTestManufactorersInput' title={t('translation:testManufacturers')}
                    infoText={<>{t('translation:RAT-list-info')}  <a className='rat-list-info-link' href={t('translation:RAT-list-info-link')} target='blank'>{t('translation:RAT-list-info-link-text')}</a></>}
                    value={testManufacturerId}
                    required={dccConsent}
                    hidden={!dccConsent}
                    onChange={(evt: any) => setTestManufacturerId(evt.target.value)}
                    valueSet={context!.valueSets![Value_Sets.TestManufacturer]}
                />

                <hr hidden={!dccConsent} />

                {/* test result radio */}
                < FormGroupRadio controlId='result-radio1' title={t('translation:result-positive')}
                    checked={testResult === TestResult.POSITIVE}
                    onChange={() => setTestResult(TestResult.POSITIVE)}
                    name="result-radios"
                    required
                />
                <hr />
                {/* test result radio */}
                < FormGroupRadio controlId='result-radio2' title={t('translation:result-negative')}
                    checked={testResult === TestResult.NEGATIVE}
                    onChange={() => setTestResult(TestResult.NEGATIVE)}
                    name="result-radios"
                    required
                />
                <hr />
                {/* test result radio */}
                < FormGroupRadio controlId='result-radio3' title={t('translation:result-failed')}
                    checked={testResult === TestResult.INVALID}
                    onChange={() => setTestResult(TestResult.INVALID)}
                    name="result-radios"
                    required
                />
            </Container>
        </Fade>
    )
}

export default TestResultInputs;