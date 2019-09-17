import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportAuthenticator, Server } from 'typescript-rest';

export class ApiServer {
    public PORT: number = +process.env.PORT || 3000;

    private readonly app: express.Application;
    private server: http.Server = null;

    constructor() {
        this.app = express();
        this.config();

        Server.useIoC();

        Server.loadServices(this.app, 'controller/*', __dirname);
        
        // Note : This disable auto-nexting
        // If we need it in a controller, we will use :
        // Context.next()
        //   Server.ignoreNextMiddlewares(true);

        this.app.use("*", function(req, res, next) {
            if (!res.headersSent) res.render("App/index.html");
            next();
        });
        // Disable swagger at this time
        // Server.swagger(this.app, { filePath: './dist/swagger.json' });
    }

    /**
     * Start the server
     */
    public async start() {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }

                // TODO: replace with Morgan call
                // tslint:disable-next-line:no-console
                console.log(`Listening to http://127.0.0.1:${this.PORT}`);

                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public async stop(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

    /**
     * Configure the express app.
     */
    private config(): void {
        // Native Express configuration
        

        this.app.use("/public", express.static(__dirname + '/public'));
        
        this.app.engine('html', require('ejs').renderFile); 
        this.app.set('views', __dirname + '/public');
        this.app.use(cors());
        this.app.use(morgan('combined'));

        

        this.configureAuthenticator();

        
    }

    private configureAuthenticator() {
        const JWT_SECRET: string = 'some-jwt-secret';
        const jwtConfig: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(JWT_SECRET)
        };
        const strategy = new Strategy(jwtConfig, (payload: any, done: (err: any, user: any) => void) => {
            done(null, payload);
        });
        const authenticator = new PassportAuthenticator(strategy, {
            deserializeUser: (user: string) => JSON.parse(user),
            serializeUser: (user: any) => {
                return JSON.stringify(user);
            }
        });
        Server.registerAuthenticator(authenticator);
        Server.registerAuthenticator(authenticator, 'secondAuthenticator');



        
    }
}