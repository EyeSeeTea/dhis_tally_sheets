import { FutureData } from "$/data/api-futures";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Id } from "$/domain/entities/Ref";
import { OrgUnitRepository } from "$/domain/repositories/OrgUnitRepository";

export class GetOrgUnitsWithChildrenUseCase {
    constructor(private orgUnitRepository: OrgUnitRepository) {}

    execute(orgUnitIds: Id[]): FutureData<OrgUnit[]> {
        return this.orgUnitRepository.getWithChildren(orgUnitIds);
    }
}
