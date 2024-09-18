import { Id } from "$/domain/entities/Ref";
import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { OrgUnitRepository } from "$/domain/repositories/OrgUnitRepository";
import { OrgUnit } from "$/domain/entities/OrgUnit";

export class OrgUnitD2Repository implements OrgUnitRepository {
    constructor(private api: D2Api) {}

    public getWithChildren(orgUnitIds: Id[]): FutureData<OrgUnit[]> {
        return apiToFuture(
            this.api.models.organisationUnits.get({
                fields: orgUnitFields,
                filter: {
                    path: orgUnitIds.map(id => ({
                        like: id,
                    })),
                },
                paging: false,
                rootJunction: "OR",
            })
        ).map(res => res.objects);
    }
}

const orgUnitFields = {
    id: true,
    name: true,
    displayName: true,
    path: true,
    level: true,
} as const;
