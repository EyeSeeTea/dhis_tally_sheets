import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";
import { Repositories } from "$/CompositionRoot";
import _ from "$/domain/entities/generic/Collection";

export class GetDataSetsByIdsUseCase {
    constructor(private repositories: Repositories) {}

    public execute(ids: Id[]): FutureData<DataSet[]> {
        return this.repositories.dataSetRepository.getByIds(ids);
    }
}
