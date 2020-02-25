export default interface Response<T> {
    message?:string;
    httpCode?:number;
    data?: T;
    Location?: string; 
};