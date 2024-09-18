import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { LandingPage } from "./landing/LandingPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                {/* Default route */}
                <Route render={() => <LandingPage />} />
            </Switch>
        </HashRouter>
    );
}
