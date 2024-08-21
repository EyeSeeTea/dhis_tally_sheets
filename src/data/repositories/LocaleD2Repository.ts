import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { LocaleRepository } from "$/domain/repositories/LocaleRepository";
import { Locale } from "$/domain/entities/Locale";

export class LocaleD2Repository implements LocaleRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Locale[]> {
        return apiToFuture(this.api.get<D2Locale[]>("locales/dbLocales")).map(d2Locales =>
            d2Locales.map(this.buildLocale)
        );
    }

    private buildLocale(d2Locale: D2Locale): Locale {
        const { id, name, displayName, locale } = d2Locale;

        return {
            id,
            name,
            displayName,
            locale,
        };
    }
}

type D2Locale = {
    name: string;
    created: string;
    lastUpdated: string;
    translations: never[];
    externalAccess: false;
    userGroupAccesses: never[];
    userAccesses: never[];
    favorites: never[];
    sharing: {
        external: false;
        users: {};
        userGroups: {};
    };
    locale: string;
    displayName: string;
    favorite: false;
    id: string;
    attributeValues: never[];
};
