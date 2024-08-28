import { describe, expect, it } from "vitest";
import { valid, withSections } from "$/domain/entities/__tests__/dataSetFixtures";
import { DataSet } from "$/domain/entities/DataSet";

describe("DataSet", () => {
    it("valid attributes should return an instance of DataSet", () => {
        expect(valid).toBeInstanceOf(DataSet);
    });

    it("should remove sections", () => {
        const dataSet = withSections;

        const sectionId = "section1";
        const updatedDataSet = dataSet.removeSection(sectionId);

        expect(updatedDataSet.sections).not.toContainEqual({ id: sectionId });
    });
});
