import { Repositories } from "$/CompositionRoot";
import { FutureData } from "$/data/api-futures";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Id } from "$/domain/entities/Ref";

export class GetOrgUnitsWithChildrenUseCase {
    constructor(private repositories: Repositories) {}

    execute(orgUnitIds: Id[]): FutureData<OrgUnit[]> {
        return this.repositories.orgUnitRepository.getWithChildren(orgUnitIds);
    }
}
