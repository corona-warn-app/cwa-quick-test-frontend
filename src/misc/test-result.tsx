import { TestResult } from './enum';

export default interface ITestResult {
    result: TestResult;
    testId: string;
    testBrandId?: string;
}