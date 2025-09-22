import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";

export type Config = {
    sheetName: string;
    fileName: string;
    administratorGroups: Id[];
    ouLabel: string;
    periodLabel: string;
    messageInfo: Record<string, string>;
};

export const defaultConfig: Config = {
    sheetName: "Datasets",
    fileName: "Tally_Sheets",
    administratorGroups: [],
    ouLabel: "",
    periodLabel: "",
    messageInfo: {
        en: i18n.t(
            "Thanks for downloading Tally Sheets! You can edit or hide this info message under settings options. For any questions or feedback, please contact us through the 'Send Feedback' button on the bottom right corner."
        ),
    },
};
