
export abstract class ConnectedUserService {
    abstract login(userId: number);
    abstract logout(userId: number);
    abstract refreshLogin(userId: number);
    abstract getConnected();
    abstract getDisconnected();
    abstract getAll();
    abstract linkPosition(userId: number, ipAddress: string);
    abstract getLatest(userId: number);
}