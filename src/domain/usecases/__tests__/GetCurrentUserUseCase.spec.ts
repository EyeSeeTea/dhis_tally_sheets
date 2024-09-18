import { getTestCompositionRoot } from "$/CompositionRoot";
import { defaultConfig } from "$/domain/entities/Config";

describe("GetCurrentUserUseCase", () => {
    it("returns user", async () => {
        const compositionRoot = getTestCompositionRoot();

        const res = compositionRoot.users.getCurrent.execute(defaultConfig);
        const user = await res.toPromise();
        expect(user.name).toEqual("John Traore");
    });
});
