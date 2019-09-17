import {GET, Path} from 'typescript-rest';

/**
 * This is a demo operation to show how to use typescript-rest library.
 */
@Path('/test')
export class HelloController {
    /**
     * Send a greeting message.
     * @param name The name that will receive our greeting message
     */
    @Path('')
    @GET
    public sayHello(): string {
        console.log("Lucas")
        return 'Hello ' + name;
    }
}
