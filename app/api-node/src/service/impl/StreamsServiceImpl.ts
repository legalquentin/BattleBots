import { StreamsService } from "../StreamsService";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton, Container } from "typescript-ioc";
import { StreamsResourceAsm } from "../../resources/asm/StreamsResourceAsm";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";
import { IStreamResource } from "../../resources/IStreamResource";

@Singleton
export class StreamsServiceImpl implements StreamsService {

    @Inject
    private service: IServiceFactory; 
   
    public async deleteOne(id: number) {
        try {
            const stream = await this.service.getStreamsRepository().findOne(id);

            if (stream !== null){
                await this.service.getStreamsRepository().delete(stream.id);
                const response: HttpResponseModel<IStreamResource> = {
                    httpCode: 200,
                    message: "Stream deleted"
                };
    
                return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
            }
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 404,
                message: "Stream not found"
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));    
        }
        catch (e){
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 400,
                message: "error"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));    
        }
    }

    public async saveOrUpdate(stream: IStreamResource){
        const streamResourceAsm = Container.get(StreamsResourceAsm);
        const entity = await streamResourceAsm.toEntity(stream);

        try {
            const finded = await this.service.getStreamsRepository().saveOrUpdate(entity);
            const resource = await streamResourceAsm.toResource(finded);
            const response: HttpResponseModel<IStreamResource> = {
                data: resource,
                httpCode: 201,
                message: "Stream inserted"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
    }

    public async deleteByBot(botId: number){
        return this.service.getStreamsRepository().deleteByBot(botId);
    }

    public async getOne(id: number) {
        const streamResourceAsm = Container.get(StreamsResourceAsm);
        const stream = await this.service.getStreamsRepository().findOne(id);
        const resource = await streamResourceAsm.toResource(stream);
         if (resource){
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 200,
                message: "Stream finded",
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
        const response: HttpResponseModel<IStreamResource> = {
            httpCode: 404,
            message: "Stream not found"   
        };
        return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
    }

    public search(options: any): Promise<StreamsEntity[]> {
        throw new Error("Method not implemented.");
    }

    public async findAll(){
        const streamResourceAsm = Container.get(StreamsResourceAsm);
        const list = await this.service.getStreamsRepository().find();
        const resources = await streamResourceAsm.toResources(list);
        const response: HttpResponseModel<Array<IStreamResource>> = {
            data: resources,
            httpCode: 200,
            message: "Stream list"
        };

        return Promise.resolve(new SendResource<HttpResponseModel<Array<IStreamResource>>>("StreamController", response.httpCode, response));
    }
}