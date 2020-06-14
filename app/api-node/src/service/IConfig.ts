export default abstract class IConfig {
    protected salt: string;
    protected secret: string;
    protected workerAddress: string;
    protected workerPort: string;
    protected workerDirectory: string;
    protected apiAddress: string;
    protected apiPort: string;
    protected apiUseSSL: boolean;
    protected apiScheme: string;
    protected homeApiNode: string;
    protected geoipService: string;
    protected expirationTime: string;
    protected s3dir: string;
    protected bucket: string;
    protected expireUrl: string;
    protected accessKeyId: string;
    protected secretAccessKey: string;

    abstract genSalt(): string;
    abstract getSecret(): string;
    abstract getExpirationTime(): string;

    abstract getWorkerAddress(): string;
    abstract getWorkerPort(): string;
    abstract getWorkerDir(): string;

    abstract getApiAddress(): string;
    abstract getApiPort(): string;
    abstract getApiUseSSL(): boolean;
    abstract getApiScheme(): string;    
    abstract getHomeApiNode(): string;
    abstract getGeoIpService(): string;

    abstract getS3Dir(): string;
    abstract getBucket(): string;
    abstract getExpireUrl(): string;

    abstract getAccessKeyId(): string;
    abstract getSecretAccessKey(): string;
};
