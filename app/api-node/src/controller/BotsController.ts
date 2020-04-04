import { Path, PreProcessor, PostProcessor  } from "typescript-rest";
import { BotsService } from "../service/BotsService";
import { Container } from "typescript-ioc";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";

@Path("/api/bots")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class BotsController {
    private botsService: BotsService;

    constructor(){
        this.botsService = Container.get(BotsService);
    }

    public list(){
        return this.botsService.findAll();
    }

    public insert(){

    }

    public delete(){

    }

    public update(){

    }

    public detail(){

    }
}
