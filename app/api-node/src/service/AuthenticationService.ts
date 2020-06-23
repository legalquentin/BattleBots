export abstract class AuthenticationService {
    public abstract authenticate(username: string, password: string);
    public abstract refresh(token: string);
    public abstract logout(userId: number);
}