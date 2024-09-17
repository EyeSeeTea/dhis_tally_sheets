import { render, RenderResult } from "@testing-library/react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { ReactNode } from "react";
import { AppContext, AppContextState } from "$/webapp/contexts/app-context";
import { getTestCompositionRoot } from "$/CompositionRoot";
import { createAdminUser } from "$/domain/entities/__tests__/userFixtures";
import { defaultConfig } from "$/domain/entities/Config";
import { D2Api } from "$/types/d2-api";

export function getTestContext() {
    const context: AppContextState = {
        api: new D2Api(), // Only relevant for OrgUnitSelector (todo: add baseUrl)
        config: defaultConfig,
        currentUser: createAdminUser(),
        compositionRoot: getTestCompositionRoot(),
    };

    return context;
}

export function getReactComponent(children: ReactNode): RenderResult {
    const context = getTestContext();

    return render(
        <AppContext.Provider value={context}>
            <SnackbarProvider>{children}</SnackbarProvider>
        </AppContext.Provider>
    );
}
