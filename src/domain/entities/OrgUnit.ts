import { NamedRef } from "$/domain/entities/Ref";

export interface OrgUnit extends NamedRef {
    displayName: string;
    path: string;
    level: number;
}
