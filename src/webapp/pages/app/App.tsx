import styled from "styled-components";
import { HeaderBar } from "@dhis2/ui";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { Feedback } from "@eyeseetea/feedback-component";
import { MuiThemeProvider } from "@material-ui/core/styles";
//@ts-ignore
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import { useConfig } from "@dhis2/app-runtime";
import { red } from "@material-ui/core/colors";
import {
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { appConfig } from "$/app-config";
import { CompositionRoot } from "$/CompositionRoot";
import Share from "$/webapp/components/share/Share";
import { AppContext, AppContextState } from "$/webapp/contexts/app-context";
import { Router } from "$/webapp/pages/Router";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";
import { D2Api } from "$/types/d2-api";
import i18n from "$/utils/i18n";
import "./App.css";

export interface AppProps {
    compositionRoot: CompositionRoot;
}

function App(props: AppProps) {
    const { baseUrl } = useConfig();
    const { compositionRoot } = props;

    const styles = useStyles();

    const [showShareButton, setShowShareButton] = useState(false);
    const [loader, setLoader] = useState("loading");
    const [appContext, setAppContext] = useState<AppContextState | null>(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        async function setup() {
            const api = new D2Api({ baseUrl, backend: "fetch" });
            const isShareButtonVisible = appConfig.appearance.showShareButton;
            const config = await compositionRoot.config.get.execute().toPromise();
            if (!config) throw new Error("Unable to retrieve configuration");
            const currentUser = await compositionRoot.users.getCurrent.execute(config).toPromise();
            if (!currentUser) throw new Error("User not logged in");

            setAppContext({ api, config, currentUser, compositionRoot });
            setShowShareButton(isShareButtonVisible);
            setLoader("loaded");
        }

        cssVarSendFeedback();
        setup().catch(err => {
            setLoader("error");
            setErr(err.message);
        });
    }, [baseUrl, compositionRoot]);

    switch (loader) {
        case "loading":
            return null;
        case "error":
            return (
                <Dialog open={true}>
                    <DialogTitle>{i18n.t("Error")}</DialogTitle>
                    <DialogContent dividers>
                        <p className={styles.errorDescription}>
                            {i18n.t(
                                "An error occurred while loading the application. Please contact your administrator."
                            )}
                        </p>
                        <pre className={styles.errorBlock}>{err}</pre>
                    </DialogContent>
                </Dialog>
            );
        case "loaded":
            return (
                <MuiThemeProvider theme={muiTheme}>
                    <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                        <SnackbarProvider>
                            <StyledHeaderBar appName="Tally sheets" />

                            {appConfig.feedback && appContext && (
                                <Feedback
                                    options={appConfig.feedback}
                                    username={appContext.currentUser.username}
                                />
                            )}

                            <div id="app" className="content">
                                <AppContext.Provider value={appContext}>
                                    <Router />
                                </AppContext.Provider>
                            </div>

                            <Share visible={showShareButton} />
                        </SnackbarProvider>
                    </OldMuiThemeProvider>
                </MuiThemeProvider>
            );
    }
}

function cssVarSendFeedback() {
    document.documentElement.style.setProperty(
        "--send-feedback",
        appConfig.feedback ? "none" : "block"
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        errorDescription: {
            margin: theme.spacing(1, 0, 2),
        },
        errorBlock: {
            color: theme.palette.error.light,
            backgroundColor: red[50],
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1),
            border: `1px solid ${red[100]}`,
        },
    })
);

const StyledHeaderBar = styled(HeaderBar)`
    div:first-of-type {
        box-sizing: border-box;
    }
`;

export default React.memo(App);
