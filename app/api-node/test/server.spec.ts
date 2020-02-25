'use strict';

import * as chai from 'chai';
import { describe, it } from 'mocha';
import { HttpMethod, Server } from 'typescript-rest';

const expect = chai.expect;

describe('Hello Controller Tests', async () => {
    describe('The Rest Server', () => {
        it('should provide a catalog containing the exposed paths', (done) => {
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
            done();
        });
    });
});
