import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosStatic, AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import _size from 'lodash/size';
import _get from 'lodash/get';

@Component
export default class ConnectionManager extends Vue {
    private config: AxiosRequestConfig = {
        baseURL: 'http://hardwar.ddns.net/api',
        timeout: 10000,
        headers: { 'X-Custom-Header': 'foobar' }
    };
    private axios: AxiosInstance;

    constructor() {
        super();
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

    private onError(error: AxiosError): Promise<AxiosResponse | string> {
        return new Promise((resolve, reject) => {
            if (!error.response) {
                return reject(error);
            }
            const errMessage: number = error.response.status;
            if (errMessage === 403 && this.getJwt()) {
                this.refreshToken().then((response: AxiosResponse) => {
                    const jwt = _get(response, 'data.data.data');
                    if (!_size(jwt)) {
                        throw 'No JWT token exception';
                    }

                    localStorage.setItem('jwt', jwt);
                    const Authorization = `Bearer ${jwt}`;
                    this.axios.defaults.headers.Authorization = Authorization;
                    error.config.headers.Authorization = Authorization;
                    this.axios.request(error.config).then((response: AxiosResponse) => {
                        resolve(response);
                    }).catch((err: AxiosError) => {
                        reject(err);
                    });
                    resolve(response);
                }).catch(() => {
                    this.$router.push({ name: 'LoginFrame' });
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
        return this.axios.get('games')
            .then((response: AxiosResponse) => {
                return _get(response, 'data.data', null);
            })
        ;
    }

    public createGame(): void {

    }

    private refreshToken(): AxiosPromise {
        return this.axios.post('users/login/up', { data: this.getJwt() });
    }

};