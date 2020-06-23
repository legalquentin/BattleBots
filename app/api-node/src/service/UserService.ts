import IUserResource from "../resources/IUserResource";

export abstract class UserService {
    public async abstract saveOrUpdate(user: IUserResource);
    public async abstract findAll();
    public async abstract deleteOne(id: number);
    public async abstract findOne(id: number);
    public async abstract getAllPositions(id: number);
}
