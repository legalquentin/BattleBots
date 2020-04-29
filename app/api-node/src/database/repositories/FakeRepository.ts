import { Repository } from "typeorm";

export class FakeRepository extends Repository<any> {
    saveOrUpdate(){
        return (null);
    }
}