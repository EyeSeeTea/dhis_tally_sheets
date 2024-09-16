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

export const defaultConfig: Config = {
    sheetName: "Datasets",
    fileName: "HMIS_Tally_Sheets",
    administratorGroups: [],
    ouLabel: "",
    periodLabel: "",
    infoPlaceholder:
        "Thanks for downloading HMIS Tally Sheets! You can edit or hide this info message placeholder under settings options. For any questions or feedback, please contact us through the 'Send Feddback' button on the bottom right corner.",
};
