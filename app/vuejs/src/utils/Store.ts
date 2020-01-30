import { Vue } from 'vue-property-decorator';

class AbstractStore extends Vue { private _isVue: boolean = false };

export default class Store extends AbstractStore {
    private jwt?: string;
    private logged: boolean = false;

    constructor() {
        super();

        this.logged = Boolean(this._checkForJWT());
    }

    /*
     * JWT token app wide access & persistency
     */ 
    private _checkForJWT(): string | boolean
    {
        /*this._jwt = localStorage.get('jwt');
        return this._jwt || false;*/
        return true;
    }

    public isLogged(): boolean
    {
        return this.logged;
    }

    /*
     * Login/Register actions
     */

    public setUnlog(): void
    {
        console.log("setUnlog");
    }

    public login(): void
    {
        console.log("setLogin");
    }

    public register(): void
    {
        console.log("setRegister");
    }
};