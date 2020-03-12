import IUserHttpModel from "../resources/IUserHttpModel";
import IUserResource from "../resources/IUserResource";
import { SendResource } from "../../lib/ReturnExtended";
import HttpResponseModel from "../resources/HttpResponseModel";
import IResourceId from "../resources/IResourceId";
import ITokenHttp from "../resources/ITokenHttp";

export abstract class UserService {
    public async abstract  login(user: IUserHttpModel): Promise<SendResource<HttpResponseModel<ITokenHttp>>>;
    public async abstract register(user: IUserResource): Promise<SendResource<HttpResponseModel<IResourceId>>>;
    public abstract profile(id: number): Promise<SendResource<HttpResponseModel<IUserResource>>>;
    public abstract list(): Promise<SendResource<HttpResponseModel<IUserResource[]>>>;
}
