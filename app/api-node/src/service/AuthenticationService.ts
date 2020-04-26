export abstract class AuthenticationService {
    public abstract authenticate(username: string, password: string);
}