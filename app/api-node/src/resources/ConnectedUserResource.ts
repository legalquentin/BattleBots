import IUserResource from "./IUserResource";
import { IGeoIpResource } from "./IGeoIpResource";

export class ConnectedUserResource {
    id?: number;
    user?: IUserResource;
    geoips?: Array<IGeoIpResource>;
    from?: Date;
    end?: Date;
}