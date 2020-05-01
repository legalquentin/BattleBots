import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportAuthenticator, Server } from 'typescript-rest';
import { Container } from 'typescript-ioc';
import config from "./ioc.config";
import IConfig from './service/IConfig';
import { UserRepository } from './database/repositories/UserRepository';

export class ApiServer {
    public PORT: number = 80; // +process.env.PORT || 8080;

    private readonly app: express.Application;
    private server: http.Server = null;
    private serviceConfig: IConfig;

    constructor() {
        this.app = express();
        this.config();

        Server.useIoC();
        const bodyParser = require('body-parser');
        this.app.use(bodyParser.json({ verify: function(req, res, buf, encoding){
            req.rawBody = buf.toString();
        }}));
        this.app.use(bodyParser.raw({ type: "*/*", verify: function(req, res, buf, encoding){
            req.rawBody = buf.toString();
        }}));
        Server.loadServices(this.app, 'controller/**/*.ts', __dirname);
        // Note : This disable auto-nexting
        // If we need it in a controller, we will use :
        // Context.next()
        //   Server.ignoreNextMiddlewares(true);

        Server.swagger(this.app, { 
            swaggerUiOptions: {
                customSiteTitle: 'BattleBots'
            },
            filePath: 'swagger.yaml',
            endpoint: "api-docs",
            host: "hardwar.ddns.net",
            schemes: ["http"]
         });
        this.app.use("*", function (req, res, next) {
            if (!res.headersSent) { res.render("App/index.html"); }
            next();
        });
    }

    public getApp(): Express.Application {
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
                console.log(`Listening to http://0.0.0.0:${this.PORT}`);
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
        Container.configure(config);
        Container.environment(process.env.NODE_ENV);
        this.configureAuthenticator();
    }

    private configureAuthenticator() {
        this.serviceConfig = Container.get(IConfig);
        const userRepository = Container.get(UserRepository);
        const JWT_SECRET: string = this.serviceConfig.getSecret();
        const jwtConfig: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(JWT_SECRET)
        };
        const strategy = new Strategy(jwtConfig, async (payload: any, done: (err: any, user: any) => void) => {
            const user = await userRepository.findOne(payload.sub);

            if (!user){
                done("User not exist", null);
            }
            else {
                const o = {
                    sub: user.id,
                    roles: user.roles
                };

                done(null, o);
            }
        });
        const authenticator = new PassportAuthenticator(strategy, {
             authOptions: {
                session: false,
                failWithError: true,
            }
        });
        Server.registerAuthenticator(authenticator, "Bearer");
    }
}
