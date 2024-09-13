import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";

export type Config = {
    sheetName: string;
    fileName: string;
    administratorGroups: Id[];
    ouLabel: string;
    periodLabel: string;
    infoPlaceholder: Maybe<string>;
};
