const shortHashLen = 8;

const processNoRegExp = new RegExp("^[A-Fa-f0-9]{" + shortHashLen + "}$");

export default {
    shortHash: (uuIdHash: string) => uuIdHash.substring(0, shortHashLen),
    isProcessNoValid: (processNo: string) => processNoRegExp.test(processNo),
}