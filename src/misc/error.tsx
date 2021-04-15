export default interface IError{
    error:any;
    message:string;
    onCancel:() => void;
}