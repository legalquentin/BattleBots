export default interface HttpResponseModel<T> {
    message?:string;
    httpCode?:number;
    data?: T;
};