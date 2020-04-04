import { StreamsService } from "../service/StreamsService";
import { Container } from "typescript-ioc";
import { Path, PreProcessor, PostProcessor  } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";

@Path("/api/streams")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class StreamsContoller {
    private streamsService: StreamsService;

    constructor(){
        this.streamsService = Container.get(StreamsService);
    }

    public list(){
        return this.streamsService.findAll();
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