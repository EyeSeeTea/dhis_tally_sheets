import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Struct } from "./generic/Struct";
import { NamedRef } from "./Ref";

export interface UserAttrs {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
    preferredLocale: string;
    organisationUnits: OrgUnit[];
    authorizations: {
        canSelectAllLocales: boolean;
    };
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export class User extends Struct<UserAttrs>() {
    belongToUserGroup(userGroupUid: string): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        return this.userRoles.some(({ authorities }) => authorities.includes("ALL"));
    }
}
