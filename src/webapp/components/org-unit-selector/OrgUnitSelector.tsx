import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    LinearProgress,
    Tooltip,
    useTheme,
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { styled } from "styled-components";
import { InfoOutlined as InfoOutlinedIcon } from "@material-ui/icons";
import { OrgUnitsSelector, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { getId } from "$/domain/entities/Ref";
import {
    MultipleSelector,
    MultipleSelectorProps,
} from "$/webapp/components/multiple-selector/MultipleSelector";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

interface OrgUnitSelectorProps {
    selected: OrgUnit[];
    onChange: (orgUnits: OrgUnit[]) => void;
    disabled?: boolean;
}

export const OrgUnitSelector: React.FC<OrgUnitSelectorProps> = React.memo(props => {
    const { onChange, selected, disabled } = props;
    const { api, currentUser, compositionRoot } = useAppContext();

    const theme = useTheme();
    const snackbar = useSnackbar();
    const classes = useStyles();

    const [isOpen, { enable: open, disable: close }] = useBooleanState(false);
    const [loading, { enable: startLoading, disable: stopLoading }] = useBooleanState(false);
    const [currentPaths, setCurrentPaths] = React.useState<string[]>([]);

    const selectedPaths = React.useMemo(() => {
        const paths = selected.map(({ path }) => path);
        const deepestCommonRoot = findCommonRoot(paths);
        return deepestCommonRoot === "" ? [] : [deepestCommonRoot];
    }, [selected]);

    const cancel = React.useCallback(() => {
        setCurrentPaths(selectedPaths);
        close();
    }, [close, selectedPaths]);

    const apply = React.useCallback(() => {
        startLoading();
        const orgUnitIds = _(currentPaths)
            .map(path => path.split("/").slice(-1))
            .flatten()
            .value();

        const ids = orgUnitIds;
        const getOrgUnits$ = compositionRoot.orgUnits.getWithChildren.execute(ids);

        getOrgUnits$.run(
            orgUnits => {
                onChange(orgUnits);
                stopLoading();
                close();
            },
            err => {
                snackbar.error(i18n.t("Unable to fetch the organisation unit children"));
                console.error(err);
                stopLoading();
                close();
            }
        );
    }, [
        startLoading,
        currentPaths,
        compositionRoot.orgUnits.getWithChildren,
        onChange,
        stopLoading,
        close,
        snackbar,
    ]);

    const initiallyExpanded = React.useMemo(() => {
        const orgUnitPath = _(selectedPaths).first();
        const parent = orgUnitPath?.split("/").slice(0, -1).join("/");
        return parent ? [parent] : undefined;
    }, [selectedPaths]);

    const openDialog = React.useCallback(() => {
        open();
        setCurrentPaths(selectedPaths);
    }, [open, selectedPaths]);

    const clear = React.useCallback(() => {
        if (_(selected).isEmpty()) cancel();
    }, [selected, cancel]);

    React.useEffect(clear, [clear]);

    const label = i18n.t("Filter by Organisation Unit");

    const selectorProps: MultipleSelectorProps = React.useMemo(() => {
        const topLevel = Math.min(...selected.map(ou => ou.level));

        const parents = _(selected)
            .filter(ou => ou.level === topLevel)
            .value();

        return {
            items: parents.map(({ id, displayName }) => ({ value: id, text: displayName })),
            values: parents.map(getId),
            onChange: () => {},
            label: i18n.t("Organisation unit"),
            name: "select-organisation-unit",
            type: "organisation unit",
            pluralType: "organisation units",
            disabled: disabled,
            customMenu: { onOpen: openDialog },
        };
    }, [selected, disabled, openDialog]);

    return (
        <>
            <MultipleSelector {...selectorProps} />
            <Dialog open={isOpen} onClose={cancel} fullWidth aria-label={label}>
                <DialogTitle>
                    <Box display="flex" gridColumnGap={theme.spacing(1)} alignItems="center">
                        {label}
                        <Tooltip
                            title={i18n.t(
                                "The children of the Organisation Unit selected will also be taken into account."
                            )}
                        >
                            <InfoOutlinedIcon color="action" />
                        </Tooltip>
                    </Box>
                </DialogTitle>

                <NoPaddingContent dividers className={classes.content}>
                    <Box>
                        <OrgUnitsSelector
                            api={api}
                            withElevation={false}
                            controls={controls}
                            hideMemberCount={false}
                            fullWidth={false}
                            height={ORG_UNIT_SELECTOR_HEIGHT}
                            onChange={setCurrentPaths}
                            selected={currentPaths}
                            singleSelection={true}
                            initiallyExpanded={initiallyExpanded}
                            selectableLevels={[3, 4, 5, 6]}
                            rootIds={currentUser.organisationUnits.map(getId)}
                            typeInput="radio"
                        />
                    </Box>
                </NoPaddingContent>

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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            padding: theme.spacing(0),
        },
    })
);

const ORG_UNIT_SELECTOR_HEIGHT = 500;

const controls = {
    filterByLevel: false,
    filterByGroup: false,
    selectAll: false,
};

const NoPaddingContent = styled(DialogContent)`
    padding: 0;
    & .MuiCardContent-root,
    & .MuiCardContent-root:last-child {
        padding: 0;
        padding-left: 1.5rem;
    }
`;
