import { expect } from 'chai';
import { after, before, describe, it } from 'mocha';
import * as request from 'request';
import * as sinon from "sinon";
import { hashSync } from "bcrypt";
import Config from '../src/service/impl/Config';
import { Container } from "typescript-ioc";
import ServiceFactory from '../src/service/impl/ServiceFactory';
import { ApiServer } from '../src/api-server';

const client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
    = request.defaults({ baseUrl: `http://localhost:${8080}` });
const serviceFactory = Container.get(ServiceFactory);
let apiServer = null;

describe('API Testing', async () => {

    before(async () => {
        apiServer = new ApiServer();

        await apiServer.start();
    });

    after(async () => {
        await apiServer.stop();
    });

    describe("User", async () => {
        let callbackFind = null;

        before(() => {
            callbackFind = sinon.stub(serviceFactory.getUserRepository(), "find");
            callbackFind.returns(Promise.resolve([]));
        });

        after(() => {
            callbackFind.restore();
        });

        it("should not found user", (done) => {
            client.post('/users/login', {
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
                    expect(response.statusCode).to.equal(404);
                }
                done();
            });
        });
    });

    describe("User#2", async () => {
        let callbackInsert = null;
        let callbackFind = null;
        let callbackPlayerInsert = null;
        let callbackFind2 = null;

        before(() => {
            const o = {
                id: 1,
                firstname: "Thomas",
                lastname: "SIMOES",
                pseudo: "simoes_t",
                email: "simoes_t@etna-alternance.net",
                hash: "azerty123",
                address: "7 rue des ulysses"
            };

            callbackInsert = sinon.stub(serviceFactory.getUserRepository(), "save");
            callbackFind = sinon.stub(serviceFactory.getUserRepository(), "find");
            callbackPlayerInsert = sinon.stub(serviceFactory.getPlayerRepository(), "save");
            callbackFind.resolves([]);
            callbackInsert.resolves(o);
            callbackPlayerInsert.resolves({
                user: o,
                total_points: 0,
                id: 1
            });
        });

        after(() => {
            callbackInsert.restore();
            callbackPlayerInsert.restore();
            callbackFind2.restore();
        });

        it('should insert and retrieve user', (done) => {
            client.post('/users', {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstname": "Thomas",
                    "lastname": "SIMOES",
                    "pseudo": "simoes_t",
                    "email": "simoes_t@etna-alternance.net",
                    "password": "azerty123",
                    "confirmation": "azerty123",
                    "address": "7 rue des ulysses"
                })
            }, (err, response, body) => {
                callbackFind.restore();
                callbackFind2 = sinon.stub(serviceFactory.getUserRepository(), "find");
                callbackFind2.resolves([
                    {
                        id: 1,
                        firstname: "Thomas",
                        lastname: "SIMOES",
                        pseudo: "simoes_t",
                        email: "simoes_t@etna-alternance.net",
                        hash: hashSync("azerty123", new Config().genSalt()),
                        address: "7 rue des ulysses"
                    }
                ]);
                expect(response.statusCode).to.equal(201);
                client.post('/users/login', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: "simoes_t",
                        password: "azerty123"
                    })
                }, (err, response, body) => {
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
        let callbackFind = null;
        let callbackFind2 = null;
        let callbackPlayerInsert = null;
        let callbackFind3 = null;

        before(() => {
            const o = {
                id: 1,
                firstname: "Thomas",
                lastname: "SIMOES",
                pseudo: "simoes_t",
                email: "simoes_t@etna-alternance.net",
                hash: "azerty123",
                address: "7 rue des ulysses"
            };

            callbackFind = sinon.stub(serviceFactory.getUserRepository(), "find");
            callbackInsert = sinon.stub(serviceFactory.getUserRepository(), "save");
            callbackPlayerInsert = sinon.stub(serviceFactory.getPlayerRepository(), "save");
            callbackInsert.resolves(o);
            callbackPlayerInsert.resolves({
                id: 1,
                total_points: 0,
                user: o
            });
            callbackFind.resolves([]);
        });

        after(() => {
            callbackInsert.restore();
            callbackFind3.restore();
            callbackPlayerInsert.restore();
        });

        it('should list user.', (done) => {
            client.post('/users', {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstname": "Thomas",
                    "lastname": "SIMOES",
                    "pseudo": "simoes_t",
                    "email": "simoes_t@etna-alternance.net",
                    "password": "azerty123",
                    "confirmation": "azerty123",
                    "address": "7 rue des ulysses"
                })
            }, (err, response, body) => {
                expect(response.statusCode).to.equal(201);
                callbackFind.restore();
                callbackFind2 = sinon.stub(serviceFactory.getUserRepository(), "find");
                callbackFind2.resolves([
                    {
                        id: 1,
                        firstname: "Thomas",
                        lastname: "SIMOES",
                        pseudo: "simoes_t",
                        email: "simoes_t@etna-alternance.net",
                        hash: hashSync("azerty123", new Config().genSalt()),
                        address: "7 rue des ulysses"
                    }
                ]);
                client.post('/users/login', {
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
                    callbackFind3 = sinon.stub(serviceFactory.getPlayerRepository(), "find");
                    callbackFind3.resolves([
                        {
                            user: {
                                id: 1,
                                firstname: "Thomas",
                                lastname: "SIMOES",
                                pseudo: "simoes_t",
                                email: "simoes_t@etna-alternance.net",
                                address: "7 rue des ulysses",
                                createdAt: new Date(),
                                updatedAt: new Date()
                            },
                            total_points: 0,
                            id: 1
                        }
                    ]);
                    client.get('/users', {
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
                        }
                        done();
                    });
                });
            });
        });
    });
});
