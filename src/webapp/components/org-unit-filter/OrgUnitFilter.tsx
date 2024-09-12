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
} from "@material-ui/core";
import { OrgUnitsSelector } from "@eyeseetea/d2-ui-components";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import i18n from "$/utils/i18n";
import _c from "$/domain/entities/generic/Collection";

interface OrgUnitFilterProps {
    selected: string[];
    onChange: (paths: string[]) => void;
}

export const OrgUnitFilter: React.FC<OrgUnitFilterProps> = React.memo(props => {
    const { onChange, selected } = props;
    const { api, currentUser } = useAppContext();

    const classes = useStyles();

    const [isOpen, { enable: open, disable: close }] = useBooleanState(false);
    const [onlyUserOU, setOnlyUserOU] = React.useState(false);
    const [current, setCurrent] = React.useState<{ selected: string[]; onlyUserOU: boolean }>({
        selected: [],
        onlyUserOU: false,
    });

    const toggleUserDataSetsOnly = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrent(({ selected }) => ({
                selected: selected,
                onlyUserOU: e.target.checked,
            }));
        },
        [setCurrent]
    );

    const updateSelected = React.useCallback((paths: string[]) => {
        setCurrent(({ onlyUserOU }) => ({ selected: paths, onlyUserOU: onlyUserOU }));
    }, []);

    const cancel = React.useCallback(() => {
        setCurrent({ selected: selected, onlyUserOU: onlyUserOU });
        close();
    }, [close, onlyUserOU, selected]);

    const apply = React.useCallback(() => {
        const userPaths = currentUser.organisationUnits.map(({ path }) => path);
        onChange(current.onlyUserOU ? userPaths : current.selected);
        setOnlyUserOU(current.onlyUserOU);
        close();
    }, [currentUser.organisationUnits, onChange, current.onlyUserOU, current.selected, close]);

    const initiallyExpanded = React.useMemo(() => {
        const orgUnitPath = _c(selected).first();
        const parent = orgUnitPath?.split("/").slice(0, -1).join("/");
        return parent ? [parent] : undefined;
    }, [selected]);

    const openDialog = React.useCallback(() => {
        open();
        setCurrent({ selected: onlyUserOU ? [] : selected, onlyUserOU: onlyUserOU });
    }, [onlyUserOU, open, selected]);

    const clear = React.useCallback(() => {
        if (_c(selected).isEmpty()) cancel();
    }, [selected, cancel]);

    React.useEffect(clear, [clear]);

    const label = i18n.t("Filter by Organisation Unit");

    return (
        <>
            <Button variant="outlined" color="primary" onClick={openDialog}>
                Open Org Unit Selector
            </Button>
            <Dialog open={isOpen} onClose={cancel} fullWidth aria-label={label}>
                <DialogTitle>{label}</DialogTitle>
                <DialogContent>
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
                            selected={current.selected}
                            singleSelection={true}
                            selectOnClick={true}
                            initiallyExpanded={initiallyExpanded}
                            typeInput="radio"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancel} color="primary">
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
