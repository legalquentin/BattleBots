import { preRequestLog } from "./log";

export async function preRequest(req: any){
    await preRequestLog(req);
    return (req);
}