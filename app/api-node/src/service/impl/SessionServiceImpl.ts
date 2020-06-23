import { SessionService } from "../SessionService";
import { IContextBotResource } from "../../resources/IContextBotResource";
import  HttpResponseModel  from "../../resources/HttpResponseModel";
import { SessionRepository } from "../../database/repositories/SessionRepository";
import { Inject } from "typescript-ioc";
import { SessionResourceAsm } from "../../resources/asm/SessionResourceAsm";
import { ISessionResource } from "../../resources/ISessionResource";
import IServiceFactory from "../IServiceFactory";
import { SessionEntity } from "../../database/entities/SessionEntity";

export class SessionServiceImpl implements SessionService {

    @Inject
    sessionRepository: SessionRepository;

    @Inject
    sessionResourceAsm: SessionResourceAsm;

    @Inject
    serviceFactory: IServiceFactory;
    
    public async save(context: IContextBotResource): Promise<HttpResponseModel<IContextBotResource>> {
        const entity : SessionEntity = this.sessionResourceAsm.toEntity(context);
        const conn = await this.serviceFactory.getUserConnectedRepository().getLatested(entity.player.id);
        entity.connected = conn;
        const saved = await this.sessionRepository.save(entity);
        const resource = this.sessionResourceAsm.toResource(saved);
        const response: HttpResponseModel<IContextBotResource> = {
            httpCode: 200,
            message: "save session",
            data: resource
        };

        return (response);
    }

    public async update(context: IContextBotResource): Promise<HttpResponseModel<IContextBotResource>> {
        const entity = this.sessionResourceAsm.toEntity(context);
        const conn = await this.serviceFactory.getUserConnectedRepository().getLatested(entity.player.id);
        entity.connected = conn;
        await this.sessionRepository.update(entity.id, entity);
        const response: HttpResponseModel<IContextBotResource> = {
            httpCode: 200,
            message: "update session"
        };

        return (response);
    }

    public async list(): Promise<HttpResponseModel<IContextBotResource[]>> {
        const sessions = await this.sessionRepository.find();
        const resources = [];

        for (let session of sessions){
            resources.push(this.sessionResourceAsm.toResource(session));
        }
        const response: HttpResponseModel<IContextBotResource[]> = {
            httpCode: 200,
            data: resources,
            message: "get all sessions"
        };
        return (response);
    }

    public async findOne(id: number): Promise<HttpResponseModel<IContextBotResource>> {
        const session = await this.sessionRepository.findOne(id);
        const resource = this.sessionResourceAsm.toResource(session);
        const response: HttpResponseModel<IContextBotResource> = {
            httpCode: 200,
            data: resource,
            message: "get one"
        };
        return (response);
    }

    public async delete(id: number) {
        const session = await this.sessionRepository.findOne(id);

        if (!session){
            const response: HttpResponseModel<IContextBotResource> = {
                httpCode: 404,
                message: "delete one"
            };
    
            return (response);
        }
        const resource = this.sessionResourceAsm.toResource(session);
        const response: HttpResponseModel<IContextBotResource> = {
            httpCode: 200,
            data: resource,
            message: "get one"
        };

        return (response);
    }

    public async findByGameId(id: number) {
        const sessions = await this.sessionRepository.findByGameId(id);
        
        if (sessions.length){
            const resources = await this.sessionResourceAsm.toSessionResources(sessions);
            const response: HttpResponseModel<ISessionResource> = {
                httpCode: 200,
                data: resources,
                message: "List sessions"
            };

            return (response);
        }
        const response: HttpResponseModel<ISessionResource> = {
            httpCode: 404,
            message: "session not found"
        };

        return (response);
    }


}