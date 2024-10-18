import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components/snackbar";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import {
    SettingsDialogProps,
    TooltipTextFieldProps,
} from "$/webapp/components/settings-dialog/SettingsDialog";
import { Maybe } from "$/utils/ts-utils";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

type Settings = {
    sheetName: string;
    fileName: string;
    administratorGroups: string;
    ouLabel: string;
    periodLabel: string;
    infoPlaceholder: Maybe<string>;
};

export function useSettingsDialog(props: SettingsDialogProps) {
    const { onClose } = props;
    const { config, compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    const [loading, { enable: startLoading, disable: stopLoading }] = useBooleanState(false);
    const [reloading, { enable: reloadPage }] = useBooleanState(false);
    const [settings, setSettings] = React.useState<Settings>({
        ...config,
        administratorGroups: config.administratorGroups.join(", "),
    });

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
    }, []);

    const handleSave = React.useCallback(() => {
        startLoading();

        const config = {
            ...settings,
            administratorGroups: _(settings.administratorGroups.split(","))
                .map(id => id.trim())
                .compact()
                .value(),
        };

        compositionRoot.config.update.execute(config).run(
            () => {
                onClose();
                snackbar.success(i18n.t("Settings saved. Reloading page..."));
                stopLoading();
                reloadPage();
                setTimeout(() => window.location.reload(), 1000);
            },
            err => {
                snackbar.error(err.message);
                stopLoading();
            }
        );
    }, [compositionRoot, onClose, reloadPage, settings, snackbar, startLoading, stopLoading]);

    const close = React.useCallback(() => {
        onClose();
        setSettings({
            ...config,
            administratorGroups: config.administratorGroups.join(", "),
        });
    }, [config, onClose]);

    const fields = React.useMemo(
        () => getTextFields(settings, handleChange),
        [handleChange, settings]
    );

    return { loading, reloading, handleSave, close, fields };
}

function getTextFields(
    settings: Settings,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
): TooltipTextFieldProps[] {
    return [
        {
            title: i18n.t(
                "The sheet name of the zip file that will be created when more than one dataset is selected"
            ),
            label: i18n.t("Sheet name"),
            name: "sheetName",
            value: settings.sheetName,
            onChange: handleChange,
        },
        {
            title: i18n.t(
                "The filename of the zip file that will be created when more than one dataset is selected"
            ),
            label: i18n.t("Filename"),
            name: "fileName",
            value: settings.fileName,
            onChange: handleChange,
        },
        {
            title: i18n.t("User Group IDs separated by commas"),
            label: i18n.t("Administrator Groups"),
            name: "administratorGroups",
            value: settings.administratorGroups,
            onChange: handleChange,
        },
        /* Temporary removing ou label, and period label */
        // {
        //     title: i18n.t(
        //         "The placeholder label that will be added next to '{{healthFacility}}: '",
        //         { healthFacility: i18n.t("Health Facility"), nsSeparator: false }
        //     ),
        //     label: i18n.t("OU label"),
        //     name: "ouLabel",
        //     value: settings.ouLabel,
        //     onChange: handleChange,
        // },
        // {
        //     title: i18n.t(
        //         "The placeholder label that will be added next to '{{reportingPeriod}}: '",
        //         { reportingPeriod: i18n.t("Reporting Period"), nsSeparator: false }
        //     ),
        //     label: i18n.t("Period label"),
        //     name: "periodLabel",
        //     value: settings.periodLabel,
        //     onChange: handleChange,
        // },
        {
            title: i18n.t(
                "The placeholder message that will be shown to users at the top of the app. You can use this field to provide instructions or other information. To hide this message, leave this field empty."
            ),
            label: i18n.t("Message placeholder"),
            name: "infoPlaceholder",
            value: settings.infoPlaceholder,
            onChange: handleChange,
            minRows: 4,
            multiline: true,
        },
    ];
}
