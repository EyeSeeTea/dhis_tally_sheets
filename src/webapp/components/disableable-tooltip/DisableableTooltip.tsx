/* When FormControl is disabled, material throws this error:
 *
 * "You are providing a disabled `button` child to the Tooltip component.
 * A disabled element does not fire events.
 * Tooltip needs to listen to the child element's events to display the title.
 * Add a simple wrapper element, such as a `span`"
 *
 * But as we do not want to fire events indeed, lets just return the children without
 * the Tooltip. */

import { Tooltip, TooltipProps } from "@material-ui/core";
import React from "react";

interface DisableableTooltipProps extends TooltipProps {
    disabled: boolean;
}

export const DisableableTooltip: React.FC<DisableableTooltipProps> = React.memo(props => {
    const { disabled, children, ...restParams } = props;
    if (disabled) return <>{children}</>;
    else return <Tooltip {...restParams}>{children}</Tooltip>;
});
