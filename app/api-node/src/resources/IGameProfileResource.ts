import IUserResource from "./IUserResource";

export default interface IGameProfileResource {
    total_points?: number;
    id?: number;
    name?: string;
    user?: IUserResource;
}