import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';
import { Server, PassportAuthenticator } from 'typescript-rest';
import { Container, Inject } from 'typescript-ioc';
import iocConfig from "./ioc.config";
import IConfig from './service/IConfig';
import { UserRepository } from './database/repositories/UserRepository';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { connectionName } from "./service/util/connectionName"; 

export abstract class ApiServer {
    public PORT: number; // +process.env.PORT || 8080;
    public scheme: string;

    protected readonly app;
     protected options: any;

    @Inject
    protected serviceConfig: IConfig;
   
    @Inject
    protected userRepository: UserRepository;

    constructor() {
        this.app = express();

        Server.useIoC();
        const bodyParser = require('body-parser');
        Container.configure(iocConfig);
        Container.environment(connectionName());
        this.config();
        Server.loadServices(this.app, 'controller/**/*.ts', __dirname);
        Server.swagger(this.app, { 
            swaggerUiOptions: {
                customSiteTitle: 'BattleBots'
            },
            filePath: 'swagger.yaml',
            endpoint: "api-docs",
            host: "hardwar.ddns.net",
            schemes: [this.serviceConfig.getApiScheme()]
        });
        this.app.use(bodyParser.json({ verify: function(req, res, buf, encoding){
            req.rawBody = buf.toString();
        }}));
        this.app.use(bodyParser.raw({ type: "*/*", verify: function(req, res, buf, encoding){
            req.rawBody = buf.toString();
        }}));
        this.app.use("*", function (req, res, next) {
            if (!res.headersSent) { res.render("App/index.html"); }
            next();
        });
    }

    public getApp(): Express.Application {
        return (this.app);
    }

    public abstract runServer();
    public abstract closeServer();

    /**
     * Start the server
     */
    public async start() {
        this.PORT = parseInt(this.serviceConfig.getApiPort(), 10);
        this.scheme = this.serviceConfig.getApiScheme();
        await this.runServer(); 
    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public async stop() {
        await this.closeServer();
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
        /**
         * Check host for update games by workers
         */
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const address = req.socket.remoteAddress;
            const endpoint = "/api/games/worker";
            const localhost = "127.0.0.1"

            if (req.url === endpoint && address === localhost) {
                next();
            }
            else if (req.url !== endpoint){
                next();
            }
            else {
                res.status(400);
                res.json(({
                    message: "ERROR"
                }));
            }
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
        const JWT_SECRET: string = this.serviceConfig.getSecret();
        const jwtConfig: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(JWT_SECRET)
        };
        const strategy = new Strategy(jwtConfig, async (payload: any, done: (err: any, user: any, info: any) => void) => {
            const user = await this.userRepository.findOne(payload.sub);
            if (!user){
                done(null, null, 403);
            }
            else {
                const o = {
                    id: user.id,
                    roles: user.roles
                };

                done(null, o, null);
            }
        });
        const authenticator = new PassportAuthenticator(strategy, {
            authOptions: {
                session: false
            }
        });
        Server.registerAuthenticator(authenticator, "Bearer");
    }
}
