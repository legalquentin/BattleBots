import { Repository } from "typeorm";
import { FakeEntity } from "../entities/FakeEntity";

export class FakeRepository extends Repository<FakeEntity> {

    constructor(){
        super();
    }

    saveOrUpdate(fake: FakeEntity){
        return (fake);
    }
}