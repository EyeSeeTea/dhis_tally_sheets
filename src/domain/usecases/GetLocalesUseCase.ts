import { Repositories } from "$/CompositionRoot";
import { FutureData } from "$/data/api-futures";
import { Locale } from "$/domain/entities/Locale";

export class GetLocalesUseCase {
    constructor(private repositories: Repositories) {}

    public execute(): FutureData<Locale[]> {
        return this.repositories.localeRepository.get();
    }
}
