export class Global {
    // States
    public isGameListInit = false;
    public isReplayListInit = false;

    // Auth
    private _token = '';

    constructor() {
        this._token = localStorage.getItem('token') || '';
        this._token.length && console.log(this.parseJwt(this._token));
    }

    public get isLogged(): boolean {
        return Boolean(this._token.length);
    }

    public get token(): string {
        return this._token;
    }

    public set token(newToken: string) {
        this._token = newToken;
        localStorage.setItem('token', this._token);
        this._token.length && console.log('--->', this.parseJwt(this._token));
    }

    private parseJwt(token): any {
        const base64Url: string = token.split('.')[1];
        const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload: string = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
}

export default new Global();