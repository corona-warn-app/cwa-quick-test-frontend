export default interface Patient {
    firstName: string;
    name: string;
    dateOfBirth: Date | Date[];
    processingConsens: boolean;
    uuId: string;
    uuIdHash: string;
}