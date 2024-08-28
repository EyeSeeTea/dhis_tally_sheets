import { describe, expect, it } from "vitest";
import {
    basicAttrsWithCustomFormType,
    basicAttrsWithHideInTallySheetsAttribute,
    validBasic,
} from "$/domain/entities/__tests__/dataSetFixtures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";

describe("BasicDataSet", () => {
    it("valid attributes should return an instance of BasicDataSet", () => {
        expect(validBasic).toBeInstanceOf(BasicDataSet);
    });
    it("should throw an error when the BasicDataSet has a formType equal to CUSTOM", () => {
        const basicDataSet = () => new BasicDataSet(basicAttrsWithCustomFormType());

        expect(basicDataSet).toThrowError("DataSet BwyMfDBLih9 has CUSTOM form type");
    });
    it("should throw an error when the BasicDataSet has an attribute with name hideInTallySheet and value true", () => {
        const basicDataSet = () => new BasicDataSet(basicAttrsWithHideInTallySheetsAttribute());

        expect(basicDataSet).toThrowError(
            "DataSet BwyMfDBLih9 marked to be ignored in Tally Sheets"
        );
    });
});
