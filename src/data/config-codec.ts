import { errors } from "$/data/repositories/d2-metadata";
import { Config, defaultConfig } from "$/domain/entities/Config";
import { Codec, string, array, optional, oneOf, record } from "purify-ts";

export const configCodec = oneOf([
    Codec.interface({
        sheetName: string,
        fileName: string,
        administratorGroups: array(string),
        ouLabel: string,
        periodLabel: string,
        infoPlaceholder: oneOf([optional(string), record(string, optional(string))]),
    }),
    Codec.interface({ administratorGroups: array(string) }), // Backwards compatibility
]);

export function decodeConfig(json: unknown, storage: string, key: string): Config {
    return configCodec.decode(json).caseOf({
        Left: (err): Config => {
            const errStr = errors.invalidJSON(storage, key);
            console.error(new Error(errStr + err));
            throw new Error(errStr);
        },
        Right: (res): Config => {
            if ("sheetName" in res) {
                const placeholder =
                    typeof res.infoPlaceholder === "string"
                        ? { en: res.infoPlaceholder }
                        : res.infoPlaceholder === undefined
                        ? { en: undefined }
                        : res.infoPlaceholder;

                return {
                    ...res,
                    infoPlaceholder: placeholder,
                };
            }
            return {
                ...defaultConfig,
                administratorGroups: res.administratorGroups,
            };
        },
    });
}
