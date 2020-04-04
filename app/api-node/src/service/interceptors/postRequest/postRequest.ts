import { postRequestLog } from "./log";

export async function postRequest(req: any){
    await postRequestLog(req);
    return (req);
}