import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosStatic, AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import _size from 'lodash/size';
import _get from 'lodash/get';

@Component
export default class ConnectionManager extends Vue {
    
    private config: AxiosRequestConfig = {
        //baseURL: process.env.VUE_APP_API_URL,
        baseURL: "http://hardwar.ddns.net/api",
        timeout: 10000,
        headers: {  }
    };
    private axios: AxiosInstance;

    constructor() {
        super();
        console.log('quentin', process.env);
        const jwt: string | null = this.getJwt();
        if (jwt) {
            this.config.headers.Authorization = `Bearer ${jwt}`;
        }

        this.axios = axios.create(this.config);

        this.axios.interceptors.response.use((response: AxiosResponse) => response, (err: AxiosError) => this.onError(err));
    }

    public setToken(token: string): void {
        this.axios.defaults.headers.Authorization = token;
    }

    private hasRefreshToken = false;

    private onError(error: AxiosError): Promise<AxiosResponse | string> {
        return new Promise((resolve, reject) => {
            if (!error.response) {
                return reject(error);
            }
            const errMessage: number = error.response.status;
            if (this.hasRefreshToken) {
                this.hasRefreshToken = false;
                console.log("test")

                return reject("LoginFrame");
            }
            if (errMessage === 403 && this.getJwt()) {
                this.refreshToken().then((response: AxiosResponse) => {
                    const jwt = _get(response, 'data.data.data');
                    console.log('->', response);
                    if (!_size(jwt)) {
                        throw 'No JWT token exception';
                    }

                    localStorage.setItem('jwt', jwt);
                    const Authorization = `Bearer ${jwt}`;
                    this.axios.defaults.headers.Authorization = Authorization;
                    error.config.headers.Authorization = Authorization;
                    this.hasRefreshToken = true;
                    this.axios.request(error.config).then((response: AxiosResponse) => {
                        resolve(response);
                    }).catch((err: AxiosError) => {
                        reject(err);
                    });
                    resolve(response);
                }).catch(() => {

                    reject("LoginFrame");
                });
            } else {
                reject(error);
            }
        });
    }

    private getJwt(): string | null {
        const jwt: string | null = localStorage.getItem('jwt');
        if (!_size(jwt)) {
            return null;
        }
        return jwt;
    }

    public login(): void {

    }

    public register(): void {

    }

    public getGameList(): Promise<AxiosResponse> {
        console.log(process.env)
        return this.axios.get('games');
        // return new Promise((resolve)=>{resolve()})
    }

    public createGame(): void {

    }

    public joinGame(gameId: number): Promise<AxiosResponse> {
        return this.axios.put(`games/join/${gameId}`);
    }

    public getGameResult(gameId: number): Promise<AxiosResponse> {
        return this.axios.get(`games/${gameId}`);
    }

    private refreshToken(): AxiosPromise {
        return this.axios.post('users/login/up', { data: this.getJwt() });
    }

};