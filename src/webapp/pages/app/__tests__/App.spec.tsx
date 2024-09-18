import { fireEvent as _fireEvent, render } from "@testing-library/react";

import App from "$/webapp/pages/app/App";
import { getTestContext } from "$/utils/tests";
import { Provider } from "@dhis2/app-runtime";

describe("App", () => {
    it("renders the feedback component", async () => {
        const view = getView();
        expect(await view.findByText("Send feedback")).toBeInTheDocument();
    });

    // TODO:
    it("with i18n translates correctly", () => {});
});

function getView() {
    const { compositionRoot } = getTestContext();
    return render(
        <Provider config={{ baseUrl: process.env["VITE_DHIS2_BASE_URL"] ?? "", apiVersion: 37 }}>
            <App compositionRoot={compositionRoot} />
        </Provider>
    );
}
