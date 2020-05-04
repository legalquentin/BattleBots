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

    abstract genSalt(): string;
    abstract getSecret(): string;

    abstract getWorkerAddress(): string;
    abstract getWorkerPort(): string;
    abstract getWorkerDir(): string;

    abstract getApiAddress(): string;
    abstract getApiPort(): string;
    abstract getApiUseSSL(): boolean;
    abstract getApiScheme(): string;    
};
