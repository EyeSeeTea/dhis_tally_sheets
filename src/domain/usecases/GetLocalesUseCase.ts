import { FutureData } from "$/data/api-futures";
import { Locale } from "$/domain/entities/Locale";
import { LocaleRepository } from "$/domain/repositories/LocaleRepository";

export class GetLocalesUseCase {
    constructor(private localeRepository: LocaleRepository) {}

    public execute(): FutureData<Locale[]> {
        return this.localeRepository.get();
    }
}
