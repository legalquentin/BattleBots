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
import * as AWS from "aws-sdk";
import * as path from "path";
import { uuid } from "uuidv4";

AWS.config.loadFromPath('/Users/quentin/D.PERS/BattleBots/app/api-node/.awsconfig.json');
@Singleton
export class StreamsServiceImpl implements StreamsService {

    @Inject
    private service: IServiceFactory; 

    @Inject
    private config: IConfig;

    
    private s3: AWS.S3;

    constructor(){
        this.s3 = new AWS.S3();

        this.s3.listBuckets((err, data) => {
            if (err){
                console.log(err.message);
            }
            else {
                console.log(data);
            }
        });
    }
    
    public uploadAll(streams: StreamsEntity[], params: any[]) {
        const ret = [];

        return (new Promise((resolve, reject) => {
            for (let i = 0; i < streams.length; i++){
                const stream = streams[i];
                const param = params[i];
                if (param == null) {
                    return resolve(null)
                }
                this.upload(stream, param, (param) => {
                    ret.push(param);
                    if (ret.length == (streams.length)){
                        return resolve(ret);
                    }
                });
            }
        }));
    }

    public getVideoLink(stream: StreamsEntity) {
        var params = { 
            Bucket: this.config.getBucket(), 
            Key: stream.s3Url, 
            Expires: this.config.getExpireUrl() };
        var url = this.s3.getSignedUrl('getObject', params);

        return (url);
    }

    public upload(stream: StreamsEntity, params: any, callback: any){
        const resolve_path = `${stream.s3Url}`;
        this.s3.upload(params, async (err, data) => {
            console.log("ERROR", err);
            if (err){
                return callback({
                    code: 400,
                    data: err
                });
            }
            fs.unlinkSync(resolve_path);
            stream.s3Url = params.Key;
            const ret: any = await this.service.getStreamsRepository().saveOrUpdate(stream);
            callback({
                code: 200,
                data: ret
            });
        });
    }

    public async watchDirectory(stream: IStreamResource){
        const streamResourceAsm = Container.get(StreamsResourceAsm);
        return new Promise(async (resolve, reject) => {
            const resolve_path = `${stream.s3Url}`;
            if (fs.existsSync(resolve_path) && fs.statSync(resolve_path).isFile()){
                const o = path.parse(resolve_path);
                console.log(o);
                const params = {
                    Key: `${uuid()}${o.ext}`,
                    Bucket: this.config.getBucket(),
                    Body: fs.createReadStream(resolve_path)
                };
                const streamEntity = await streamResourceAsm.toEntity(stream);
                console.log(params.Bucket);
                console.log(params.Key);
                this.upload(streamEntity, params, async (o) => {
                    console.log("ERROR", o.err);
                    const response: HttpResponseModel<IStreamResource> = {
                        message: o.err.message,
                        httpCode: o.code
                    };

                    resolve(response);
                });
            }
            else {
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
                message: "Stream found",
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