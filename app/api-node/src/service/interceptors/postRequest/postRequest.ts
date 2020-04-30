import { postRequestLog } from "./log";

export async function postRequest(req: any, res: any){
    await postRequestLog(req, res);
    return (req);
}