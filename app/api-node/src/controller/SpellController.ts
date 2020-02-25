import { Path, Security, GET } from "typescript-rest";
import { SpellResource } from "../resources/SpellResource";
import Response from "../resources/Response";
import SpellEntityAsm from "../resources/asm/SpellEntityAsm";
import { Repository, getRepository } from "typeorm";
import { SpellEntity } from "../database/entities/SpellEntity";
import { SendResource } from "../../lib/ReturnExtended";

@Path("/spell")
export class SpellController {

    private asm: SpellEntityAsm;
    private spellRepository: Repository<SpellEntity>;

    constructor() {
        this.asm = new SpellEntityAsm();
        this.spellRepository = getRepository(SpellEntity);
    }


    @Path("/")
    @GET
    @Security("ROLE_USER")
    public list(): Promise<SendResource<Response<SpellResource[]>>> {
        return new Promise<SendResource<Response<SpellResource[]>>>(async (end) => {
            const list = await this.spellRepository.find();

            end(new SendResource<Response<SpellResource[]>>("SpellController", 200, {
                httpCode: 200,
                message: "list spell",
                data: this.asm.toResources(list)
            }))
        });
    }
}