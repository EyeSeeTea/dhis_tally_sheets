import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAppContext } from "$/webapp/contexts/app-context";
import { LoadingState, SelectorProps } from "$/webapp/pages/landing/useDataSetSelector";
import { Locale } from "$/domain/entities/Locale";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

export function useLanguageSelector(
    availableLocales: string[],
    preferredLocale: string,
    canSelectAllLocales: boolean
): SelectorProps<Locale> {
    const { compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    const [locales, setLocales] = React.useState<Locale[]>([]);
    const [loading, setLoading] = React.useState<LoadingState>("loading");
    const [selected, setSelected] = React.useState<string[]>([]);

    const available = React.useMemo(
        () => locales.filter(locale => availableLocales?.includes(locale.code)),
        [availableLocales, locales]
    );

    const items = React.useMemo(
        () =>
            available.map(locale => ({
                value: locale.code,
                text: locale.displayName,
            })),
        [available]
    );

    const onChange = React.useCallback((values: string[]) => {
        setSelected(values);
    }, []);

    const allValue = "all-languages";

    const props: SelectorProps<Locale> = React.useMemo(
        () => ({
            items: items,
            values: selected,
            onChange: onChange,
            label: i18n.t("Language"),
            name: "select-language",
            loading: loading,
            type: "language",
            pluralType: "languages",
            allItems: available,
            disabled: loading === "loading" || _(available).isEmpty(),
            allOption: canSelectAllLocales
                ? {
                      value: allValue,
                      text: i18n.t("ALL"),
                  }
                : undefined,
            allSelected: selected.includes(allValue),
            selectedItems: selected.includes(allValue)
                ? available
                : available.filter(i => selected.includes(i.code)),
        }),
        [items, selected, onChange, loading, available, canSelectAllLocales]
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

    React.useEffect(() => {
        const preferredIsAvailable = available.map(locale => locale.code).includes(preferredLocale);
        const codes = available.map(locale => locale.code);

        setSelected(selected => {
            return _(selected).isEmpty() && preferredIsAvailable
                ? [preferredLocale]
                : _(selected)
                      .select(s => codes.includes(s) || (s === allValue && _(codes).isNotEmpty()))
                      .value();
        });
    }, [available, preferredLocale]);

    return props;
}
