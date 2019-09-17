'use strict';

import { Path, GET, ContextResponse, Return } from 'typescript-rest';
import { Response } from 'express';
import { NoResponse } from '../types';

@Path('/')
class DefaultController
{
    @Path('') 
    @GET public serveRoute(@ContextResponse res: Response) : NoResponse
    {
        res.render("App/index.html");

        return Return.NoResponse;
    }
}

export { DefaultController }