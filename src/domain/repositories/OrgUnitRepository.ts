import { FutureData } from "$/data/api-futures";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Id } from "$/domain/entities/Ref";

export interface OrgUnitRepository {
    getWithChildren(orgUnitId: Id): FutureData<OrgUnit[]>;
}
