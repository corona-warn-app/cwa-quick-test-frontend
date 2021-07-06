import React from "react";

import '../../i18n';
import { useTranslation } from 'react-i18next';

import { TestResult } from "../../misc/enum";
import { FormGroupInput, FormGroupRadio } from "./form-group.component";
import useLocalStorage from "../../misc/useLocalStorage";
import ITestResult from "../../misc/test-result";
import { ITests, useGetTests } from "../../api";


const TestResultInputs = (props: any) => {

    const { t } = useTranslation();

    const [testResult, setTestResult] = React.useState<TestResult>();

    const [testId, setTestId] = useLocalStorage('testId', '');
    const [testName, setTestName] = useLocalStorage('testName', '');

    const tests = useGetTests();

    React.useEffect(() => {
        if (testResult) {
            const result: ITestResult = {
                testBrandId: testId,
                testBrandName: testName,
                result: testResult
            }

            props.onChange(result);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testId, testName, testResult])


    const handleTestChange = (evt: any, change: (str: string) => void) => {
        const value = evt.currentTarget.value;
        // console.log(value);

        if (tests && value) {
            const id = (value as string).slice(0, 8);
            const name = (value as string).slice(11);
            // console.log(id);
            // console.log(name);

            const find = tests.find((item) => (value.length <= 15 || item.testBrandName === name) && item.testBrandId === id);
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


    return (
        <>
            {/* test-ID input */}
            < FormGroupInput controlId='formTestIdInput' title={t('translation:test-id')}
                value={testId}
                onChange={handleTestIdChange}
                required
                maxLength={15}
                datalistId='testid-list'
                datalist={tests ? tests.map((i: ITests) => <option key={i.testBrandId} value={i.testBrandId + ' - ' + i.testBrandName} />) : undefined}
            />

            <hr />
            {/* test-name input */}
            < FormGroupInput controlId='formTestNameInput' title={t('translation:test-name')}
                value={testName}
                onChange={handleTestNameChange}
                required
                maxLength={200}
                datalistId='testname-list'
                datalist={tests ? tests.map((i: ITests) => <option key={i.testBrandId} value={i.testBrandId + ' - ' + i.testBrandName} />) : undefined}
            />

            <hr />
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
        </>
    )
}

export default TestResultInputs;