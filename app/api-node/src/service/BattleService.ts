export abstract class BattleService {
    public abstract create();
    public abstract join(id: number);
    public abstract exit(id: number);
}