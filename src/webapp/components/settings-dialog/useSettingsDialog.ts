import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components/snackbar";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import {
    SettingsDialogProps,
    TooltipTextFieldProps,
} from "$/webapp/components/settings-dialog/SettingsDialog";
import { Maybe } from "$/utils/ts-utils";
import { HashMap } from "$/domain/entities/generic/HashMap";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

type Settings = {
    sheetName: string;
    fileName: string;
    administratorGroups: string;
    ouLabel: string;
    periodLabel: string;
    messageInfo: Record<string, Maybe<string>>;
};

export function useSettingsDialog(props: SettingsDialogProps & { localeCode: string }) {
    const { onClose, localeCode } = props;
    const { config, compositionRoot } = useAppContext();

    const snackbar = useSnackbar();

    const [loading, { enable: startLoading, disable: stopLoading }] = useBooleanState(false);
    const [reloading, { enable: reloadPage }] = useBooleanState(false);
    const [settings, setSettings] = React.useState<Settings>({
        ...config,
        administratorGroups: config.administratorGroups.join(", "),
    });

    const updateSettings = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
    }, []);

    const updateMessage = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            messageInfo: {
                ...prevSettings.messageInfo,
                [name]: value.trim() === "" ? undefined : value,
            },
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
            messageInfo: HashMap.fromObject(settings.messageInfo).compact().toObject(),
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
        () => getTextFields(settings, updateSettings),
        [updateSettings, settings]
    );

    const messageProps: TooltipTextFieldProps = React.useMemo(
        () => ({
            title: i18n.t(
                "The message that will be shown to users at the top of the app. You can use this field to provide instructions or other information. To hide this message, leave this field empty."
            ),
            label: i18n.t("Information message"),
            name: localeCode,
            value: settings.messageInfo[localeCode] ?? "",
            onChange: updateMessage,
            minRows: 4,
            multiline: true,
        }),
        [localeCode, settings, updateMessage]
    );

    const messageChanged = React.useMemo(() => {
        return settings.messageInfo[localeCode] !== config.messageInfo[localeCode];
    }, [config.messageInfo, localeCode, settings.messageInfo]);

    return { loading, reloading, handleSave, close, fields, messageProps, messageChanged };
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
    ];
}
