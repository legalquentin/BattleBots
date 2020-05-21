enum GameStatus {
    CREATED = 'CREATED',
};

export default interface IGame {
    id: number,
    name: string,
    status: GameStatus,
    bots: unknown[],
};