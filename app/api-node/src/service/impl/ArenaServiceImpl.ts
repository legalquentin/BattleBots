import { ArenaService } from "../ArenaService";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton, Container } from "typescript-ioc";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import { ArenaResourceAsm } from "../../resources/asm/ArenaResourceAsm";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";
import { IArenaResource } from "../../resources/IArenaResource";

@Singleton
export class ArenaServiceImpl implements ArenaService {

    @Inject
    private factory: IServiceFactory;

    public async saveOrUpdate(arena: IArenaResource){
        const arenaResourceAsm = Container.get(ArenaResourceAsm);
        try {
            const toSave = await arenaResourceAsm.toEntity(arena);
            const saved = await this.factory.getArenaRepository().saveOrUpdate(toSave);
            const resource = await arenaResourceAsm.toResource(saved);
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 201,
                message: "Arena inserted",
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));       
        }
        catch (e){
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: "Bad Request"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
    }

    public async findOne(id: number) {
        const arenaResourceAsm = Container.get(ArenaResourceAsm);
        try {
            const arena = await this.factory.getArenaRepository().getOne(id);
            if (!arena){
                const response: HttpResponseModel<IArenaResource> = {
                    httpCode: 404,
                    message: "Arena not found",
                };
    
                return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
            }
            const resource = await arenaResourceAsm.toResource(arena);
            if (await this.factory.getBotsRepository().hasBotsByArena(arena.id)){
                await arenaResourceAsm.addBotResource(arena, resource);
            }
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                message: "Arena details",
                data: resource
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }
        catch (e) {
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
    }

    public async findAll(){
        const arenaResourceAsm = Container.get(ArenaResourceAsm);
        try {
            const list = await this.factory.getArenaRepository().findAll();
            const resources = await arenaResourceAsm.toResources(list);
            const response : HttpResponseModel<IArenaResource[]> = {
                httpCode: 200,
                message: "Arena list",
                data: resources
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource[]>>("ArenaController", response.httpCode, response));       
        }
        catch (e){
            const response : HttpResponseModel<IArenaResource[]> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource[]>>("ArenaController", response.httpCode, response));        
        }
    }

    public async deleteOne(id: number) {
        try {
            const arena = await this.factory.getArenaRepository().findOne(id);
            const response : HttpResponseModel<IArenaResource> = {};

            if (arena != null)
            {
                await this.factory.getArenaRepository().delete(arena.id);
                response.httpCode = 200;
                response.message = "Arena deleted";
            }
            else
            {
                response.message = "Arena not found";
                response.httpCode = 404;
            }
            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));       
        }
        catch (e){
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
    }

    public async linkBot(arenaId: number, botId: number) {
        const arenaResourceAsm = Container.get(ArenaResourceAsm);
        try {
            const arena = await this.factory.getBotsArenaRepository().linkBot(arenaId, botId);
            const resource = await arenaResourceAsm.toResource(arena);
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                data: resource,
                message: `link bot ${botId} to arena ${arenaId}`
            };
            
            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }   
        catch (e){
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };
            
            if (e.code == EEntityStatus.NOT_FOUND){
                response.httpCode = 404;
            }
            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }
    }
}
