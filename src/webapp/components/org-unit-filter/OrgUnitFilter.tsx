import React from "react";
import { OrgUnitsSelector } from "@eyeseetea/d2-ui-components";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";
import i18n from "$/utils/i18n";

interface OrgUnitFilterProps {}

export const OrgUnitFilter: React.FC<OrgUnitFilterProps> = React.memo(props => {
    const [open, setOpen] = React.useState(false);
    const [userDataSetsOnly, setUserDataSetsOnly] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const toggleUserDataSetsOnly = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setUserDataSetsOnly(e.target.checked),
        []
    );

    const label = i18n.t("Filter by Organisation Unit");

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open Org Unit Selector
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth aria-label={label}>
                <DialogTitle>{label}</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userDataSetsOnly}
                                onChange={toggleUserDataSetsOnly}
                                name="userDataSetsOnly"
                                color="primary"
                            />
                        }
                        label={i18n.t("Show only current user's organisation units data sets")}
                    />
                    {/* <OrgUnitsSelector /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
