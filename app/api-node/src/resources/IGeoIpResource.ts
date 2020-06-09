import IUserResource from "./IUserResource";

export class IGeoIpResource {
    public user?: IUserResource;
    public longitude?: number;
    public latitude?: number;
    public ip?: string;
    public country?: string;
    public city?: string;
    public timezone?: string;
}