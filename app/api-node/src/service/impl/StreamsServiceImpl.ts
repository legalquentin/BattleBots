import { StreamsService } from "../StreamsService";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton, Container } from "typescript-ioc";
import { StreamsResourceAsm } from "../../resources/asm/StreamsResourceAsm";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";
import { IStreamResource } from "../../resources/IStreamResource";
import IConfig from "../IConfig";
import * as fs from "fs"
import * as path from "path";
import { uuid } from "uuidv4";
var AWS = require("aws-sdk");

@Singleton
export class StreamsServiceImpl implements StreamsService {

    @Inject
    private service: IServiceFactory; 

    @Inject
    private config: IConfig;

    private s3: any;

    constructor(){
        AWS.config.getCredentials((err) => {
            if (err) console.log(err.stack);
            // credentials not loaded
            else {
              console.log("Access key:", AWS.config.credentials.accessKeyId);
            }
        });

        console.log(process.env)
        this.s3 = new AWS.S3();

        this.s3.listBuckets((err, data) => {
            if (err){
                console.log(err.message);
            }
            else {
                console.log(data);
            }
        })
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
        console.log("enter");
        return new Promise((resolve, reject) => {
            const resolve_path = `${stream.s3Url}`;
            console.log(resolve_path);
            if (fs.existsSync(resolve_path) && fs.statSync(resolve_path).isFile()){
                const o = path.parse(resolve_path);
                console.log(o);
                const params = {
                    Key: `${uuid()}${o.ext}`,
                    Bucket: this.config.getBucket(),
                    Body: fs.createReadStream(resolve_path)
                };
                console.log(params.Bucket);
                console.log(params.Key);
                this.s3.upload(params, async (err, data) => {
                    console.log("enter");
                    console.log(err);
                    if (err){
                        const response: HttpResponseModel<IStreamResource> = {
                            message: err.message,
                            httpCode: 400
                        };

                        return resolve(response);
                    }
                    console.log("here");
                    stream.s3Url = params.Key;
                    fs.unlinkSync(resolve_path);
                    const ret: any = await this.saveOrUpdate(stream);
                    const response: HttpResponseModel<IStreamResource> = {
                        httpCode: 200,
                        message: "stream updated",
                        data: ret.data
                    };

                    resolve(response);
                });
            }
            else {
                console.log("file not found, has it been deleted ?")
                const response: HttpResponseModel<IStreamResource> = {
                    httpCode: 400,
                    message: "File not found"
                };
                resolve(response);
            }
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