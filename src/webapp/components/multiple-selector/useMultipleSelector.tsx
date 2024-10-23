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
        type = i18n.t("item"),
        pluralType = i18n.t("items"),
    } = props;

    const [menuIsOpen, { enable: openMenu, disable: closeMenu }] = useBooleanState(false);
    const [tooltipIsOpen, { enable: openTooltip, disable: closeTooltip }] = useBooleanState(false);
    const [filterText, setFilterText] = React.useState("");

    const notifyChange = React.useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(
                (event.target.value as (string | undefined | null)[])
                    .filter<string>(s => s !== undefined && s !== null && typeof s === "string")
                    .filter(s => s !== "multiple-selector-void")
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
        else if (_(values).isEmpty()) return ["multiple-selector-void"];
        else return values;
    }, [allOption, isAllSelected, values]);

    const helperText = React.useMemo(() => {
        const all = allOption && isAllSelected;
        const length = (all ? items : selected).length;

        return (
            length !== 0 &&
            i18n.t("{{length}} {{type}} selected", {
                length: length,
                type: length > 1 ? pluralType : type,
            })
        );
    }, [allOption, isAllSelected, items, pluralType, selected, type]);

    const virtualValues = React.useMemo(
        () => (customMenu?.onOpen && selected.length > 500 ? selected.slice(0, 10) : selected),
        [customMenu?.onOpen, selected]
    );

    const renderItems = React.useMemo(() => {
        return customMenu?.onOpen && items.length > 500 ? items.slice(0, 10) : items;
    }, [customMenu?.onOpen, items]);

    const filteredItems = React.useMemo(
        () => renderItems.filter(item => includesInsensitive(item.text, filterText)),
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

function includesInsensitive(text: string, filterText: string) {
    return text.toLowerCase().includes(filterText.toLowerCase());
}
