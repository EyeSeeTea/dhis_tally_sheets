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
    selectedPaths: string[];
    onChange: (paths: string[]) => void;
}

export const OrgUnitFilter: React.FC<OrgUnitFilterProps> = React.memo(props => {
    const { onChange, selectedPaths } = props;
    const { api, currentUser } = useAppContext();

    const classes = useStyles();

    const [isOpen, { enable: open, disable: close }] = useBooleanState(false);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [onlyCurrentUserOU, setOnlyCurrentUserOU] = React.useState(false);

    const toggleUserDataSetsOnly = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setOnlyCurrentUserOU(e.target.checked);
    }, []);

    const update = React.useCallback((paths: string[]) => {
        setSelected(paths);
    }, []);

    const reset = React.useCallback(() => {
        setOnlyCurrentUserOU(false);
        setSelected(selectedPaths);
        close();
    }, [close, selectedPaths]);

    const apply = React.useCallback(() => {
        const userPaths = currentUser.organisationUnits.map(({ path }) => path);
        onChange(onlyCurrentUserOU ? userPaths : selected);
        close();
    }, [close, currentUser.organisationUnits, onChange, onlyCurrentUserOU, selected]);

    const initiallyExpanded = React.useMemo(() => {
        const orgUnitPath = _c(selectedPaths).first();
        const parent = orgUnitPath?.split("/").slice(0, -1).join("/");
        return parent ? [parent] : undefined;
    }, [selectedPaths]);

    React.useEffect(() => {
        if (_c(selectedPaths).isEmpty()) {
            console.log("huhhh");
            reset();
        }
    }, [reset, selectedPaths]);

    const label = i18n.t("Filter by Organisation Unit");

    return (
        <>
            <Button variant="outlined" color="primary" onClick={open}>
                Open Org Unit Selector
            </Button>
            <Dialog open={isOpen} onClose={reset} fullWidth aria-label={label}>
                <DialogTitle>{label}</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyCurrentUserOU}
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
                        className={onlyCurrentUserOU ? classes.show : classes.hide}
                        component="span"
                        role="presentation"
                    />
                    <Box className={onlyCurrentUserOU ? classes.hide : classes.show}>
                        <OrgUnitsSelector
                            api={api}
                            withElevation={false}
                            controls={controls}
                            hideMemberCount={false}
                            fullWidth={false}
                            height={ORG_UNIT_SELECTOR_HEIGHT}
                            onChange={update}
                            selected={selected}
                            singleSelection={true}
                            selectOnClick={true}
                            initiallyExpanded={initiallyExpanded}
                            typeInput="radio"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={reset} color="primary">
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
