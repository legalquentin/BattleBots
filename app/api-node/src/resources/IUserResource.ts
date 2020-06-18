import { IBotsResource } from "./IBotsResource";
import { ERolesStatus } from "./ERolesStatus";

export default interface IUserResource {
    id?: number;
    firstname?: string;
    lastname?: string;
    pseudo: string;
    email: string;
    roles: ERolesStatus;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
    password?: string;
    gameProfile?: Array<IBotsResource>
};