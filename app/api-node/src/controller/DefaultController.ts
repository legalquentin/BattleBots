'use strict';

import { Path, GET, ContextResponse, Return } from 'typescript-rest';
import { NoResponse } from '../types';
import { Response } from 'express-serve-static-core';

@Path('/')
class DefaultController
{
    @Path('/') 
    @GET public serveRoute(@ContextResponse res: Response) : NoResponse
    {
        res.render("App/index.html");
        return Return.NoResponse;
    }
}

export { DefaultController }