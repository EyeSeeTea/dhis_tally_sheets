import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    FormControlLabel,
    Switch,
    Box,
    createStyles,
    makeStyles,
    Theme,
    LinearProgress,
} from "@material-ui/core";
import { OrgUnitsSelector, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import {
    MultipleSelector,
    MultipleSelectorProps,
} from "$/webapp/components/multiple-selector/MultipleSelector";
import i18n from "$/utils/i18n";
import _c from "$/domain/entities/generic/Collection";

interface OrgUnitSelectorProps {
    selected: OrgUnit[];
    onChange: (orgUnits: OrgUnit[]) => void;
    disabled?: boolean;
}

export const OrgUnitSelector: React.FC<OrgUnitSelectorProps> = React.memo(props => {
    const { onChange, selected, disabled } = props;
    const { api, currentUser, compositionRoot } = useAppContext();

    const classes = useStyles();
    const snackbar = useSnackbar();

    const [isOpen, { enable: open, disable: close }] = useBooleanState(false);
    const [loading, { enable: startLoading, disable: stopLoading }] = useBooleanState(false);
    const [onlyUserOU, setOnlyUserOU] = React.useState(false);
    const [current, setCurrent] = React.useState<{ selectedPaths: string[]; onlyUserOU: boolean }>({
        selectedPaths: [],
        onlyUserOU: false,
    });

    const selectedPaths = React.useMemo(() => {
        const paths = selected.map(({ path }) => path);
        const deepestCommonRoot = findCommonRoot(paths);
        return deepestCommonRoot === "" ? [] : [deepestCommonRoot];
    }, [selected]);

    const toggleUserDataSetsOnly = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrent(({ selectedPaths }) => ({
                selectedPaths: selectedPaths,
                onlyUserOU: e.target.checked,
            }));
        },
        [setCurrent]
    );

    const updateSelected = React.useCallback((paths: string[]) => {
        setCurrent(({ onlyUserOU }) => ({ selectedPaths: paths, onlyUserOU: onlyUserOU }));
    }, []);

    const cancel = React.useCallback(() => {
        setCurrent({ selectedPaths: selectedPaths, onlyUserOU: onlyUserOU });
        close();
    }, [close, onlyUserOU, selectedPaths]);

    const apply = React.useCallback(() => {
        startLoading();
        const userOrgUnitIds = currentUser.organisationUnits.map(({ id }) => id);
        const orgUnitIds = _c(current.selectedPaths)
            .map(path => path.split("/").slice(-1))
            .flatten()
            .value();

        const ids = current.onlyUserOU ? userOrgUnitIds : orgUnitIds;
        const getOrgUnits$ = compositionRoot.orgUnits.getWithChildren.execute(ids);

        getOrgUnits$.run(
            orgUnits => {
                onChange(orgUnits);
                setOnlyUserOU(current.onlyUserOU);
                stopLoading();
                close();
            },
            err => {
                snackbar.error(err.message);
                stopLoading();
                close();
            }
        );
    }, [
        startLoading,
        currentUser.organisationUnits,
        current.selectedPaths,
        current.onlyUserOU,
        compositionRoot.orgUnits.getWithChildren,
        onChange,
        stopLoading,
        close,
        snackbar,
    ]);

    const initiallyExpanded = React.useMemo(() => {
        const orgUnitPath = _c(selectedPaths).first();
        const parent = orgUnitPath?.split("/").slice(0, -1).join("/");
        return parent ? [parent] : undefined;
    }, [selectedPaths]);

    const openDialog = React.useCallback(() => {
        open();
        setCurrent({ selectedPaths: onlyUserOU ? [] : selectedPaths, onlyUserOU: onlyUserOU });
    }, [onlyUserOU, open, selectedPaths]);

    const clear = React.useCallback(() => {
        if (_c(selected).isEmpty()) cancel();
    }, [selected, cancel]);

    React.useEffect(clear, [clear]);

    const label = i18n.t("Filter by Organisation Unit");

    const selectorProps: MultipleSelectorProps = React.useMemo(
        () => ({
            items: selected.map(({ id, displayName }) => ({ value: id, text: displayName })),
            values: selected.map(({ id }) => id),
            onChange: () => {},
            label: i18n.t("Select an organisation unit"),
            name: "select-organisation-unit",
            type: "organisation unit",
            pluralType: "organisation units",
            disabled: disabled,
            customMenu: { onOpen: openDialog },
        }),
        [selected, disabled, openDialog]
    );

    return (
        <>
            <MultipleSelector {...selectorProps} />
            <Dialog open={isOpen} onClose={cancel} fullWidth aria-label={label}>
                <DialogTitle>{label}</DialogTitle>
                <DialogContent dividers>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={current.onlyUserOU}
                                onChange={toggleUserDataSetsOnly}
                                name="userDataSetsOnly"
                                color="primary"
                            />
                        }
                        label={i18n.t("Select current user's Organisation Units (and children)")}
                    />
                    {/* Prevent flashing the User on switch is toggled */}
                    <Box
                        height={ORG_UNIT_SELECTOR_HEIGHT + 84}
                        className={current.onlyUserOU ? classes.show : classes.hide}
                        component="span"
                        role="presentation"
                    />
                    <Box className={current.onlyUserOU ? classes.hide : classes.show}>
                        <OrgUnitsSelector
                            api={api}
                            withElevation={false}
                            controls={controls}
                            hideMemberCount={false}
                            fullWidth={false}
                            height={ORG_UNIT_SELECTOR_HEIGHT}
                            onChange={updateSelected}
                            selected={current.selectedPaths}
                            singleSelection={true}
                            selectOnClick={true}
                            initiallyExpanded={initiallyExpanded}
                            typeInput="radio"
                        />
                    </Box>
                </DialogContent>
                <LinearProgress hidden={!loading} />
                <DialogActions>
                    <Button onClick={cancel} color="default">
                        {i18n.t("Cancel")}
                    </Button>
                    <Button onClick={apply} color="primary">
                        {i18n.t("Apply")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

function findCommonRoot(arr: string[]) {
    return arr.reduce(
        (prefix, str) =>
            prefix.split("").reduce((acc, char, i) => acc + (char === str[i] ? char : ""), ""),
        arr[0] ?? ""
    );
}

const ORG_UNIT_SELECTOR_HEIGHT = 500;

const useStyles = makeStyles((_theme: Theme) =>
    createStyles({
        show: {
            display: "inherit",
        },
        hide: {
            display: "none",
        },
    })
);

const controls = {};
