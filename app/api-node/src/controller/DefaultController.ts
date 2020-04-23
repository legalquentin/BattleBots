'use strict';

import { Path, GET, ContextResponse, Return, Security } from 'typescript-rest';
import { Response } from 'express-serve-static-core';
import * as swagger from "typescript-rest-swagger";

@Path('/')
class DefaultController
{

    @swagger.Produces("text/html")
    @swagger.Response(200)
    @Path('/') 
    @GET public serveRoute(@ContextResponse res: Response)
    {
        res.render("App/index.html");
        return Return.NoResponse;
    }

    @GET
    @Path("/health")
    public health(@ContextResponse res: Response){
        res.status(200);
        res.end(new Date().toISOString());
    }

    @GET
    @Path("/secure_health")
    @Security("ROLE_USER", "Bearer")
    public secure_health(@ContextResponse res: Response){
        res.status(200);
        res.end();
    }
}

export { DefaultController }