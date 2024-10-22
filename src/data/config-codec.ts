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
