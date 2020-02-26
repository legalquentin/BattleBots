'use strict';

import { Path, GET, ContextResponse, Return } from 'typescript-rest';
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
}

export { DefaultController }