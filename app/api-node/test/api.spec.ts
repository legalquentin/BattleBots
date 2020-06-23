import { expect } from 'chai';
import { after, before, describe, it } from 'mocha';
import * as request from 'request';
import * as sinon from "sinon";
import { hashSync } from "bcrypt";
import IConfig from '../src/service/IConfig';
import { Container } from "typescript-ioc";
import IServiceFactory from '../src/service/IServiceFactory';
import { ApiServerFactory } from '../src/api-server-factory';

let client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl> = null;
let apiServer = null;
let serviceFactory : IServiceFactory = null;

describe('API Testing', async () => {

    before(async () => {
        const factory = new ApiServerFactory();

        apiServer = factory.getServer();
        await apiServer.start();
        const config: IConfig = Container.get(IConfig);
        client = request.defaults({ baseUrl: `${config.getApiScheme()}://${config.getApiAddress()}:${config.getApiPort()}` });
        serviceFactory = Container.get(IServiceFactory);
    });

    after(async () => {
        await apiServer.stop();
    });

    describe("User", async () => {
        let callbackFind = null;

        before(() => {
            callbackFind = sinon.stub(serviceFactory.getUserRepository(), "findOne");
            callbackFind.returns(Promise.resolve(null));
        });

        after(() => {
            callbackFind.restore();
        });

        it("should not found user", (done) => {
            client.post('/api/users/login', {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "test",
                    password: "test"
                })
            }, (err, response, body) => {
                if (err) {
                    throw err;
                }
                else {
                    expect(response.statusCode).to.equal(403);
                }
                done();
            });
        });
    });

    describe("User#2", async () => {
        let callbackInsert = null;
        let callbackFind2 = null;

        before(() => {
            const config : IConfig = Container.get(IConfig);
            const o = {
                id: 1,
                firstname: "Thomas",
                lastname: "SIMOES",
                pseudo: "simoes_t",
                email: "simoes_t@etna-alternance.net",
                hash: hashSync("azerty123", config.genSalt()),
                address: "7 rue des ulysses"
            };
            callbackInsert = sinon.stub(serviceFactory.getUserRepository(), "saveOrUpdate");
            callbackInsert.resolves(o);
        });

        after(() => {
            callbackInsert.restore();
        });

        it('should insert and retrieve user', (done) => {
            const config : IConfig = Container.get(IConfig);
            client.post('/api/users', {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstname": "Thomas",
                    "lastname": "SIMOES",
                    "pseudo": "simoes_t",
                    "email": "simoes_t@etna-alternance.net",
                    "password": "azerty123",
                    "address": "7 rue des ulysses"
                })
            }, (err, response, body) => {
                callbackFind2 = sinon.stub(serviceFactory.getUserRepository(), "findOne");
                callbackFind2.resolves({
                        id: 1,
                        firstname: "Thomas",
                        lastname: "SIMOES",
                        pseudo: "simoes_t",
                        email: "simoes_t@etna-alternance.net",
                        hash: hashSync("azerty123", config.genSalt()),
                        address: "7 rue des ulysses"
                });
                expect(response.statusCode).to.equal(201);
                client.post('/api/users/login', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: "simoes_t",
                        password: "azerty123"
                    })
                }, (err, response, body) => {
                    callbackFind2.restore();
                    if (err) {
                        console.log(err.message);
                    }
                    else {
                        expect(response.statusCode).to.equal(200);
                    }
                    done();
                });
            });
        });
    });

    describe("User#3", () => {
        let token = null;
        let callbackInsert = null;
        let callbackFind2 = null;
        let callbackPlayerInsert = null;
        let callbackFind3 = null;
        let callFindOne = null;
        let callbackConnected = null;

        before(() => {
            const config : IConfig = Container.get(IConfig);
            const o = {
                id: 1,
                firstname: "Thomas",
                lastname: "SIMOES",
                pseudo: "simoes_t",
                email: "simoes_t@etna-alternance.net",
                hash: hashSync("azerty123", config.genSalt()),
                address: "7 rue des ulysses"
            };
            callbackInsert = sinon.stub(serviceFactory.getUserRepository(), "saveOrUpdate");
            callbackPlayerInsert = sinon.stub(serviceFactory.getPlayerRepository(), "saveOrUpdate");
            callbackConnected = sinon.stub(serviceFactory.getUserConnectedRepository(), "getLatested");
            callbackInsert.resolves(o);
            callbackPlayerInsert.resolves({
                id: 1,
                total_points: 0,
                user: o
            });
            callbackConnected.resolves({
                endConnected: new Date(new Date().getTime() + 10 * 1000 * 60),
                startConnected: new Date(new Date().getTime() / 2)
            })
        });

        after(() => {
            callbackInsert.restore();
            callbackFind3.restore();
            callbackPlayerInsert.restore();
            callbackConnected.restore();
        });

        it('should list user.', (done) => {
            client.post('/api/users', {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstname": "Thomas",
                    "lastname": "SIMOES",
                    "pseudo": "simoes_t",
                    "email": "simoes_t@etna-alternance.net",
                    "password": "azerty123",
                    "address": "7 rue des ulysses"
                })
            }, (err, response, body) => {
                const config : IConfig = Container.get(IConfig);
                expect(response.statusCode).to.equal(201);
                callbackFind2 = sinon.stub(serviceFactory.getUserRepository(), "findOne");
                callbackFind2.resolves({
                        id: 1,
                        firstname: "Thomas",
                        lastname: "SIMOES",
                        pseudo: "simoes_t",
                        email: "simoes_t@etna-alternance.net",
                        hash: hashSync("azerty123", config.genSalt()),
                        address: "7 rue des ulysses"
                });
                client.post('/api/users/login', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: "simoes_t",
                        password: "azerty123"
                    })
                }, (err, response, body) => {
                    expect(response.statusCode).to.equal(200);
                    const data = JSON.parse(body).data.data;
                    token = data;
                    callbackFind2.restore();
                    callFindOne = sinon.stub(serviceFactory.getUserRepository(), "findOne");
                    callbackFind3 = sinon.stub(serviceFactory.getUserRepository(), "find");
                    callbackFind3.resolves([
                        {
                            id: 1,
                            firstname: "Thomas",
                            lastname: "SIMOES",
                            pseudo: "simoes_t",
                            email: "simoes_t@etna-alternance.net",
                            roles: "ROLE_USER",
                            address: "7 rue des ulysses",
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ]);
                    callFindOne.resolves({
                            id: 1,
                            firstname: "Thomas",
                            lastname: "SIMOES",
                            pseudo: "simoes_t",
                            email: "simoes_t@etna-alternance.net",
                            roles: "ROLE_USER",
                            address: "7 rue des ulysses",
                            createdAt: new Date(),
                            updatedAt: new Date()
                    })
                    client.get('/api/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }, (err, response, body) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            expect(response.statusCode).to.equal(200);
                            const data = JSON.parse(body);
                            expect(data.data.length).to.equal(1);
                            callFindOne.restore();
                        }
                        done();
                    });
                });
            });
        });
    });
});
