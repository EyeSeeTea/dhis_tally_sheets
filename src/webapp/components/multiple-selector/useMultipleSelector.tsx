import React from "react";
import { useBooleanState } from "$/webapp/utils/use-boolean";
import { MultipleSelectorProps } from "$/webapp/components/multiple-selector/MultipleSelector";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";

export function useMultipleSelector(props: MultipleSelectorProps) {
    const {
        items,
        values,
        onChange,
        allOption,
        customMenu,
        type = "item",
        pluralType = "items",
    } = props;

    const [menuIsOpen, { enable: openMenu, disable: closeMenu }] = useBooleanState(false);
    const [tooltipIsOpen, { enable: openTooltip, disable: closeTooltip }] = useBooleanState(false);
    const [filterText, setFilterText] = React.useState("");

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(
                (event.target.value as string[]).filter(
                    s => s !== "multiple-selector-void" && s !== undefined && s !== null
                )
            );
        },
        [onChange]
    );

    const filter = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    }, []);

    const isAllSelected = React.useMemo(
        () => (allOption ? values.includes(allOption.value) : false),
        [allOption, values]
    );

    const selected = React.useMemo(() => {
        if (isAllSelected && allOption) return [allOption.value];
        else return _(values).isEmpty() ? ["multiple-selector-void"] : values;
    }, [allOption, isAllSelected, values]);

    const helperText = React.useMemo(() => {
        if (allOption && isAllSelected)
            return `${items.length} ${items.length > 1 ? pluralType : type} ` + i18n.t("selected");

        const selectedCount = selected.filter(
            v => v !== "multiple-selector-void" && v !== undefined
        ).length;

        return selectedCount
            ? `${selectedCount} ${selectedCount > 1 ? pluralType : type} ` + i18n.t("selected")
            : undefined;
    }, [allOption, isAllSelected, items.length, pluralType, selected, type]);

    const virtualValues = React.useMemo(
        () => (customMenu?.onOpen && selected.length > 500 ? selected.slice(0, 10) : selected),
        [customMenu?.onOpen, selected]
    );

    const renderItems = React.useMemo(() => {
        return customMenu?.onOpen && items.length > 500 ? items.slice(0, 10) : items;
    }, [customMenu?.onOpen, items]);

    const filteredItems = React.useMemo(
        () =>
            renderItems.filter(item => item.text.toLowerCase().includes(filterText.toLowerCase())),
        [renderItems, filterText]
    );

    return {
        menuIsOpen,
        openMenu,
        closeMenu,
        tooltipIsOpen,
        openTooltip,
        closeTooltip,
        filterText,
        setFilterText,
        notifyChange,
        filter,
        isAllSelected,
        selected,
        helperText,
        virtualValues,
        filteredItems,
    };
}
