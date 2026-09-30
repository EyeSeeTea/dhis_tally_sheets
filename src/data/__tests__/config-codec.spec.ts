import { describe, expect, it } from "vitest";
import { decodeConfig } from "$/data/config-codec";

const STORAGE = "dataStore";
const KEY = "config";

const storedConfig = {
    sheetName: "Sheets",
    fileName: "Tally",
    administratorGroups: ["group_id"],
    ouLabel: "Facility",
    periodLabel: "Period",
    messageInfo: { en: "Hello" },
};

describe("decodeConfig", () => {
    describe("highlightSubSections", () => {
        it("defaults to false and keeps the other values for a config saved before it existed", () => {
            expect(decodeConfig(storedConfig, STORAGE, KEY)).toEqual({
                ...storedConfig,
                highlightSubSections: false,
            });
        });

        it("decodes the stored value", () => {
            const config = { ...storedConfig, highlightSubSections: true };

            expect(decodeConfig(config, STORAGE, KEY)).toEqual(config);
        });
    });
});
