'use strict';

import { Path, GET, ContextResponse, Security } from 'typescript-rest';
import * as swagger from "typescript-rest-swagger";

@Path('/')
class DefaultController
{

    @swagger.Produces("text/html")
    @swagger.Response(200)
    @Path('/') 
    @GET public serveRoute(@ContextResponse res)
    {
        res.render("App/index.html");
        res.end();
    }

    @GET
    @Path("/health")
    public health(@ContextResponse res){
        res.status(200);
        res.end(new Date().toISOString());
    }

    @GET
    @Path("/secure_health")
    @Security("ROLE_USER", "Bearer")
    public secure_health(@ContextResponse res){
        res.status(200);
        res.end();
    }
}

export { DefaultController }
