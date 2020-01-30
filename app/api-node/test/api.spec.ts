//import { Connection, createConnection } from 'typeorm';
import * as chai from 'chai';
import { after, before, describe, it } from 'mocha';
import * as request from 'request';
//import { HttpMethod, Server } from 'typescript-rest';
import { start } from '../src/start';
const expect = chai.expect;
const client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
    = request.defaults({ baseUrl: `http://localhost:${8080}` });
let token = "";
let apiServer = null;

/**
 * Delete compose images
 * Run test migrations
 */

describe('API Testing', async () => {

    before(async () => {
        apiServer = await start();
    });

    after(() => {
        apiServer.stop();
    });

    describe("User", () => {
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
                expect(response.statusCode).to.equal(404);
                done();
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
                    const data = JSON.parse(body).data.data;
                    token = data;
                    done();
                });
            });
        });
    });

    describe("Battle", () => {
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
                expect(response.statusCode).to.equal(200)
                done();
            });
        });

        it("Battle delete", (done) => {
            client.defaults({
                auth: {
                    bearer: token
                }
            }).delete(`/battle/1`, (err, resp, body) => {
                expect(resp.statusCode).to.equal(200);
                done();
            })
        });
    });
});