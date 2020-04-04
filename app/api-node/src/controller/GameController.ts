import { GameService } from "../service/GameService";
import { Container } from "typescript-ioc";
import { Path, PreProcessor, PostProcessor  } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";

@Path("/api/games")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class GameController {
    private gameService: GameService;

    constructor(){
        this.gameService = Container.get(GameService);
    }

    public start(){

    }

    public stop(){

    }

    public create(){

    }

    public end(){

    }

    public botsJoin(){

    }

    public list(){
        return this.gameService.findAll();
    }

    public detail(){
        
    }

    public insert(){

    }

    public update(){

    }

    public delete(){

    }
}