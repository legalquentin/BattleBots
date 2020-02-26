'use strict';

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HttpMethod, Server } from 'typescript-rest';

describe('Hello Controller Tests', async () => {
    describe('The Rest Server', () => {
        it('should provide a catalog containing the exposed paths', (done) => {
            expect(Server.getPaths()).to.include.members([
                "/",
                "/users/login",
                "/users/",
                "/users/profile",
                "/users/profile/:id"
            ]);
            expect(Server.getHttpMethods('/users/')).to.have.members([HttpMethod.GET, HttpMethod.POST]);
            done();
        });
    });
});
