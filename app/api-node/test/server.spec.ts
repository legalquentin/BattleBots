'use strict';

import * as chai from 'chai';
import { after, before, describe, it } from 'mocha';
import { HttpMethod, Server } from 'typescript-rest';
import { ApiServer } from "../src/api-server";

const expect = chai.expect;

let apiServer = new ApiServer();

describe('Hello Controller Tests', () => {

    before(async () => {
        await apiServer.start();
    });

    after(async () => {
        await apiServer.stop();
    });

    describe('The Rest Server', () => {
        it('should provide a catalog containing the exposed paths', () => {
            expect(Server.getPaths()).to.include.members([
                "/battle/",
                "/battle/join",
                "/battle/:battleId",
                "/",
                "/spell/",
                "/users/login",
                "/users/:id",
                "/users/"
            ]);
            expect(Server.getHttpMethods('/battle/')).to.have.members([HttpMethod.GET, HttpMethod.POST]);
            expect(Server.getHttpMethods('/users/')).to.have.members([HttpMethod.GET, HttpMethod.POST]);
        });
    });
});
