import { SessionService } from "../SessionService";
import { IContextBotResource } from "../../resources/IContextBotResource";
import  HttpResponseModel  from "../../resources/HttpResponseModel";
import { SessionRepository } from "../../database/repositories/SessionRepository";
import { Inject } from "typescript-ioc";
import { SessionResourceAsm } from "../../resources/asm/SessionResourceAsm";

export class SessionServiceImpl implements SessionService {

    @Inject
    sessionRepository: SessionRepository;

    @Inject
    sessionResourceAsm: SessionResourceAsm;
    
    public async save(context: IContextBotResource): Promise<HttpResponseModel<IContextBotResource>> {
        const entity = this.sessionResourceAsm.toEntity(context);
        const saved = await this.sessionRepository.save(entity);
        const resource = this.sessionResourceAsm.toResource(saved);
        const response: HttpResponseModel<IContextBotResource> = {
            httpCode: 200,
            message: "save session"
        };

        return (response);
    }

    public async update(context: IContextBotResource): Promise<HttpResponseModel<IContextBotResource>> {
        const entity = this.sessionResourceAsm.toEntity(context);
        const update = await this.sessionRepository.update(entity.id, entity);
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

}