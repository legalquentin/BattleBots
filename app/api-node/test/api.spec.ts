//import { Connection, createConnection } from 'typeorm';
import * as chai from 'chai';
import { after, before, describe, it } from 'mocha';
import * as request from 'request';
//import { HttpMethod, Server } from 'typescript-rest';
import { start } from '../src/start';
import { clear } from "./db/clear";
const expect = chai.expect;
const client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
    = request.defaults({ baseUrl: `http://localhost:${8080}` });
let apiServer = null;

describe('API Testing', async () => {

    before(async () => {
        await clear();
        apiServer = await start();
    });

    after(async () => {
        await apiServer.stop();
    });

    describe("User", async () => {
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
                    done();
                }
            });
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
                    done();
                });
            });
        });
    });
    /*

    describe("Battle", async () => {
        it("Battle add", (done) => {
            client.defaults({
                auth: {
                    bearer: token
                }
            }).post("/battle", {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "Battle 02"
                })
            }, (err, resp, body) => {
                expect(resp.statusCode).to.equal(201);
                done();
            });
        });

        it("Battle list", (done) => {
            client.defaults({
                auth: {
                    bearer: token
                }
            }).get("/battle", (err, response, body) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("Battle delete", (done) => {
            client.defaults({
                auth: {
                    bearer: token
                }
            }).delete(`/battle/1`, (err, resp, body) => {
                expect(resp.statusCode).to.equal(200);
                done();
            });
        });
    });
    */
    describe("Rest", () => {
        let token = null;

        it('should return 200.', (done) => {
            client.post('/users', {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstname": "Thomas",
                    "lastname": "SIMOES",
                    "pseudo": "simoes_t2",
                    "email": "simoes_t2@etna-alternance.net",
                    "password": "azerty123",
                    "confirmation": "azerty123",
                    "address": "7 rue des ulysses"
                })
            }, (err, response, body) => {
                client.post('/users/login', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: "simoes_t2",
                        password: "azerty123"
                    })
                }, (err, response, body) => {
                    expect(response.statusCode).to.equal(200);
                    const data = JSON.parse(body).data.data;
                    token = data;
                    client.get('/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }, (err, response, body) => {
                        if (err){
                            throw err;
                        }
                        else {
                            expect(response.statusCode).to.equal(200);
                        }
                        done();
                    });
                 });
            });
        });
    });
});
