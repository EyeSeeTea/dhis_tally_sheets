import { errors } from "$/data/repositories/d2-metadata";
import { Config, defaultConfig } from "$/domain/entities/Config";
import { Codec, string, array, optional, oneOf, record, boolean } from "purify-ts";

export const configCodec = oneOf([
    Codec.interface({
        sheetName: string,
        fileName: string,
        administratorGroups: array(string),
        ouLabel: string,
        periodLabel: string,
        messageInfo: oneOf([optional(string), record(string, string)]),
        highlightSubSections: optional(boolean), // Absent in configs saved before it existed
    }),
    Codec.interface({ administratorGroups: array(string) }), // Backwards compatibility
]);

export function decodeConfig(json: unknown, storage: string, key: string): Config {
    return configCodec.decode(json).caseOf({
        Left: err => {
            const errStr = errors.invalidJSON(storage, key);
            console.error(new Error(err));
            console.error(new Error(errStr));
            throw new Error(errStr);
        },
        Right: (res): Config => {
            if ("sheetName" in res) {
                const message =
                    typeof res.messageInfo === "string"
                        ? { en: res.messageInfo }
                        : res.messageInfo === undefined
                        ? {}
                        : res.messageInfo;

                return {
                    ...res,
                    messageInfo: message,
                    highlightSubSections:
                        res.highlightSubSections ?? defaultConfig.highlightSubSections,
                };
            }

            return {
                ...defaultConfig,
                administratorGroups: res.administratorGroups,
            };
        },
    });
}
