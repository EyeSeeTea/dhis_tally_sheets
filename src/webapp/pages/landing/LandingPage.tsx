import React from "react";
import {
    MultipleSelector,
    MultipleSelectorProps,
} from "$/webapp/components/multiple-selector/MultipleSelector";
import { Box, Button, Checkbox, FormControlLabel, Paper, useTheme } from "@material-ui/core";
import { GetApp as DownloadIcon, Print as PrintIcon } from "@material-ui/icons";
import i18n from "$/utils/i18n";

export const LandingPage: React.FC = React.memo(() => {
    const theme = useTheme();

    const [options, setOptions] = React.useState({
        includeHeaders: true,
        allLanguages: false,
        allDatasets: false,
    });

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setOptions({ ...options, [event.target.name]: event.target.checked });
        },
        [options]
    );

    const datasetSelectorProps = useDatasetSelector();
    const languageSelectorProps = useLanguagesSelector();

    return (
        <Box margin={theme.spacing(0.5)}>
            <Paper>
                <Box display="flex" justifyContent="space-between" padding={theme.spacing(0.5)}>
                    <Box display="flex" flexDirection="column">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={options.includeHeaders}
                                    onChange={handleChange}
                                    name="includeHeaders"
                                    color="primary"
                                />
                            }
                            label={i18n.t("Include headers")}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={options.allLanguages}
                                    onChange={handleChange}
                                    name="allLanguages"
                                    color="primary"
                                />
                            }
                            label={i18n.t("Select all languages")}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={options.allDatasets}
                                    onChange={handleChange}
                                    name="allDatasets"
                                    color="primary"
                                />
                            }
                            label={i18n.t("Select all datasets")}
                        />
                        <Box
                            display="flex"
                            marginTop={theme.spacing(0.25)}
                            gridColumnGap={theme.spacing(3)}
                        >
                            {!options.allDatasets && <MultipleSelector {...datasetSelectorProps} />}
                            {!options.allLanguages && (
                                <MultipleSelector {...languageSelectorProps} />
                            )}
                        </Box>
                    </Box>
                    <Box display="flex" gridColumnGap={theme.spacing(3)} alignItems="flex-start">
                        <Button variant="contained" color="default" startIcon={<PrintIcon />}>
                            {i18n.t("Print")}
                        </Button>
                        <Button variant="contained" color="primary" startIcon={<DownloadIcon />}>
                            {i18n.t("Export to MS Excel")}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
});

function useDatasetSelector(): MultipleSelectorProps {
    const [selected, setSelected] = React.useState<string[]>([]);

    const onChange = React.useCallback((values: string[]) => {
        setSelected(values);
    }, []);

    const props: MultipleSelectorProps = React.useMemo(
        () => ({
            items: [
                { value: "dataset1", text: "Dataset 1" },
                { value: "dataset2", text: "Dataset 2" },
            ],
            values: selected,
            onChange: onChange,
            label: i18n.t("Select a dataset"),
            name: "select-dataset",
        }),
        [selected, onChange]
    );

    return props;
}

function useLanguagesSelector(): MultipleSelectorProps {
    const [selected, setSelected] = React.useState<string[]>([]);

    const onChange = React.useCallback((values: string[]) => {
        setSelected(values);
    }, []);

    const props: MultipleSelectorProps = React.useMemo(
        () => ({
            items: [
                { value: "en", text: "English" },
                { value: "fr", text: "French" },
                { value: "es", text: "Spanish" },
            ],
            values: selected,
            onChange: onChange,
            label: i18n.t("Select a language"),
            name: "select-language",
        }),
        [selected, onChange]
    );

    return props;
}
