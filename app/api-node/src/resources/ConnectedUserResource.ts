import IUserResource from "./IUserResource";

export class ConnectedUserResource {
    id?: number;
    user?: IUserResource;
    from?: Date;
    end?: Date;
}