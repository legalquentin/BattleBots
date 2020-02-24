import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportAuthenticator, Server } from 'typescript-rest';
import Config from './service/config';

export class ApiServer {
    public PORT: number = 8080; // +process.env.PORT || 8080;

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



        const bodyParser = require('body-parser');
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        
            this.app.use("*", function (req, res, next) {

               // if (!res.headersSent) { res.status(404).send("Not found") }
                if (!res.headersSent) { res.render("App/index.html"); }
                next();
            });
        
        // Disable swagger at this time
        // Server.swagger(this.app, { filePath: './dist/swagger.json' });
    }

    public getApp() : Express.Application {
        return (this.app);
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

        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", req.get("Origin"));
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Origin, Referer, UserAgent, charset, X-Requested-With, Content-Type, Accept");
            res.status(200);
            next();
        });

        this.app.use("/public", express.static(__dirname + '/public'));

        this.app.engine('html', require('ejs').renderFile);
        this.app.set('views', __dirname + '/public');
        this.app.use(cors());
        if (process.env.NODE_ENV !== "test") {
            this.app.use(morgan('combined'));
        }

        this.configureAuthenticator();
    }

    private configureAuthenticator() {
        const JWT_SECRET: string = new Config().getSecret();
        const jwtConfig: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(JWT_SECRET)
        };
        const strategy = new Strategy(jwtConfig, (payload: any, done: (err: any, user: any) => void) => {
            const o = {
                sub: payload.sub,
                roles: [payload.role]
            };

            done(null, o);
        });
        const authenticator = new PassportAuthenticator(strategy, {
            authOptions: {
                session: false,
            }
        });

        Server.registerAuthenticator(authenticator);
       // Server.registerAuthenticator(authenticator, 'secondAuthenticator');
    }
}