import { createStyles, makeStyles, Theme } from "@material-ui/core";

// TODO: replace makeStyles with styled-components
export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headers: {
            border: "1px solid black",
            padding: "0 0.25em",
            fontWeight: 400,
        },
        title: {
            fontSize: "1.75em",
        },
        subtitle: {
            fontSize: "1.5em",
            fontWeight: 400,
        },
        deleteButton: {
            maxWidth: "2rem",
            minWidth: "unset",
            marginRight: theme.spacing(2),
        },
    })
);
