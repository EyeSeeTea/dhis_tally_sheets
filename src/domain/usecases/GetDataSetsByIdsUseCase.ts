import { FutureData } from "$/data/api-futures";
import { DataSet } from "$/domain/entities/DataSet";
import { Id } from "$/domain/entities/Ref";
import { DataSetRepository } from "$/domain/repositories/DataSetRepository";
import { Future } from "$/domain/entities/generic/Future";
import _c from "$/domain/entities/generic/Collection";

export class GetDataSetsByIdsUseCase {
    cache: DataSet[];

    constructor(private dataSetRepository: DataSetRepository) {
        this.cache = [];
    }

    public execute(ids: Id[]): FutureData<DataSet[]> {
        return Future.success(this.cache.filter(dataSet => ids.includes(dataSet.id))).flatMap(
            cachedDataSets => {
                const uncachedIds = ids.filter(id => !this.cache.map(({ id }) => id).includes(id));
                if (_c(uncachedIds).isEmpty()) {
                    return Future.success(cachedDataSets);
                } else {
                    return this.dataSetRepository.getByIds(uncachedIds).map(uncachedDataSets => {
                        this.cache = this.cache.concat(uncachedDataSets);
                        return cachedDataSets.concat(uncachedDataSets);
                    });
                }
            }
        );
    }
}
