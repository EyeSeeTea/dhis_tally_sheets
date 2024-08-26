import { describe, expect, it } from "vitest";
import {
    basicAttrsWithCustomFormType,
    basicAttrsWithHideInTallySheetsAttribute,
    validBasicAttrs,
} from "$/domain/entities/__tests__/dataSetFixtures";
import { BasicDataSet } from "$/domain/entities/BasicDataSet";

describe("BasicDataSet", () => {
    it("constructor should return an instance of BasicDataSet", () => {
        const basicDataSet = new BasicDataSet(validBasicAttrs());

        expect(basicDataSet).toBeInstanceOf(BasicDataSet);
    });
    it("static method create should return an instance of BasicDataSet", () => {
        const basicDataSet = BasicDataSet.create(validBasicAttrs());

        expect(basicDataSet).toBeInstanceOf(BasicDataSet);
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
    it("static method create should throw an error when the BasicDataSet has a formType equal to CUSTOM", () => {
        const basicDataSet = () => BasicDataSet.create(basicAttrsWithCustomFormType());

        expect(basicDataSet).toThrowError("DataSet BwyMfDBLih9 has CUSTOM form type");
    });
    it("static method create should throw an error when the BasicDataSet has an attribute with name hideInTallySheet and value true", () => {
        const basicDataSet = () => BasicDataSet.create(basicAttrsWithHideInTallySheetsAttribute());

        expect(basicDataSet).toThrowError(
            "DataSet BwyMfDBLih9 marked to be ignored in Tally Sheets"
        );
    });
});
