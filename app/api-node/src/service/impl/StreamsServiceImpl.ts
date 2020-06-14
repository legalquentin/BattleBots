import { StreamsService } from "../StreamsService";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton, Container } from "typescript-ioc";
import { StreamsResourceAsm } from "../../resources/asm/StreamsResourceAsm";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";
import { IStreamResource } from "../../resources/IStreamResource";
import { watch } from "chokidar";
import IConfig from "../IConfig";
import * as fs from "fs"
import * as AWS from "aws-sdk";
import * as path from "path";
import { uuid } from "uuidv4";


@Singleton
export class StreamsServiceImpl implements StreamsService {

    @Inject
    private service: IServiceFactory; 

    @Inject
    private config: IConfig;

    private s3: AWS.S3;

    constructor(){
        this.s3 = new AWS.S3({
            accessKeyId: this.config.getAccessKeyId(),
            secretAccessKey: this.config.getSecretAccessKey()
        });
    }

    public getVideoLink(stream: StreamsEntity) {
        var params = { 
            Bucket: this.config.getBucket(), 
            Key: stream.s3Url, 
            Expires: this.config.getExpireUrl() };
        var url = this.s3.getSignedUrl('getObject', params);

        return (url);
    }

    public async watchDirectory(stream: IStreamResource){
        return new Promise((resolve, reject) => {
            const handle = watch(this.config.getS3Dir(), {
                persistent: true
            });
            
            handle.on('add', (filepath) => {
                const o = path.parse(filepath);
                const params = {
                    Key: `${uuid()}.${o.ext}`,
                    Bucket: this.config.getBucket(),
                    Body: fs.createReadStream(filepath)
                };

                this.s3.upload(params, async (err, data) => {
                    if (err){
                        reject(err);
                    }
                    console.log(data);
                    stream.s3Url = params.Key;
                    fs.unlinkSync(filepath);
                    const ret = await this.saveOrUpdate(stream);
                    resolve(ret);
                    await handle.unwatch(this.config.getS3Dir());
                });
            });
        });
    }
   
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

        try {
            const entity = await streamResourceAsm.toEntity(stream);
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
                message: "Bad Request"
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
        if (stream){
            stream.s3Url = this.getVideoLink(stream);
        }
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
        const ret = list.map((item) => {
            item.s3Url = this.getVideoLink(item);
            return (item);
        });
        const resources = await streamResourceAsm.toResources(ret);
        const response: HttpResponseModel<Array<IStreamResource>> = {
            data: resources,
            httpCode: 200,
            message: "Stream list"
        };

        return Promise.resolve(new SendResource<HttpResponseModel<Array<IStreamResource>>>("StreamController", response.httpCode, response));
    }
}