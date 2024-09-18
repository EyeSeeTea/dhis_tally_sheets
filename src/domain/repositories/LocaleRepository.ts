import { FutureData } from "$/data/api-futures";
import { Locale } from "$/domain/entities/Locale";

export interface LocaleRepository {
    get(): FutureData<Locale[]>;
}
