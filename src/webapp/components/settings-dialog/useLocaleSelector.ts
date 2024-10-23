import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAppContext } from "$/webapp/contexts/app-context";
import { LoadingState } from "$/webapp/pages/landing/useDataSetSelector";
import { Locale } from "$/domain/entities/Locale";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

export function useLocaleSelector() {
    const { compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    const [locales, setLocales] = React.useState<Locale[]>([]);
    const [loading, setLoading] = React.useState<LoadingState>("loading");
    const [selected, setSelected] = React.useState<string>("en");

    const items = React.useMemo(
        () =>
            locales.map(locale => ({
                value: locale.code,
                text: locale.displayName,
            })),
        [locales]
    );

    const props = React.useMemo(
        () => ({
            items: items,
            value: selected,
            onChange: setSelected,
            name: "select-language",
            label: i18n.t("Language"),
            disabled: loading === "loading",
        }),
        [items, selected, loading]
    );

    React.useEffect(
        () =>
            compositionRoot.locales.get.execute().run(
                locales => {
                    setLocales(locales);
                    setLoading("loaded");
                },
                err => {
                    snackbar.error(i18n.t("Unable to fetch languages list"));
                    console.error(err);
                    setLoading("error");
                }
            ),
        [compositionRoot, snackbar]
    );

    return props;
}
