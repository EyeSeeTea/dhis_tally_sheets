import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";

export type Config = {
    sheetName: string;
    fileName: string;
    administratorGroups: Id[];
    ouLabel: string;
    periodLabel: string;
    infoPlaceholder: Record<string, string>;
};

export const defaultConfig: Config = {
    sheetName: "Datasets",
    fileName: "HMIS_Tally_Sheets",
    administratorGroups: [],
    ouLabel: "",
    periodLabel: "",
    infoPlaceholder: {
        en: i18n.t(
            "Thanks for downloading HMIS Tally Sheets! You can edit or hide this info message placeholder under settings options. For any questions or feedback, please contact us through the 'Send Feedback' button on the bottom right corner."
        ),
    },
};
