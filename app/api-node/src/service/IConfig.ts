export default abstract class IConfig {
    protected salt: string;
    protected secret: string;
    protected workerAddress: string;
    protected workerPort: string;
    protected workerDirectory: string;

    abstract genSalt(): string;
    abstract getSecret(): string;

    abstract getWorkerAddress(): string;
    abstract getWorkerPort(): string;
    abstract getWorkerDir(): string;
};
