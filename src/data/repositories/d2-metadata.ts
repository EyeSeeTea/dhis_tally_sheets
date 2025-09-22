import i18n from "$/utils/i18n";

export const constants = {
    constantsStorageCode: "TALLY_SHEETS_STORAGE",
    constantsStorageName: "Tally Sheets Storage",
    datastoreNamespace: "Tally_Sheets",
    datastoreKey: "config",
    hideAttributeName: "hideInTallySheet",
};

export const errors = {
    invalidJSON: (storage: string, key: string) =>
        i18n.t("The {{storage}} {{key}} is not a valid JSON object.", {
            storage: storage,
            key: key,
        }),
};
