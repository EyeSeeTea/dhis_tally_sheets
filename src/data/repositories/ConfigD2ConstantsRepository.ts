import { FutureData } from "$/data/api-futures";
import { Config } from "$/domain/entities/Config";
import { Future } from "$/domain/entities/generic/Future";
import { ConfigRepository } from "$/domain/repositories/ConfigRepository";
import { D2Api } from "$/types/d2-api";
import i18n from "$/utils/i18n";

export class ConfigD2ConstantsRepository implements ConfigRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Config> {
        return Future.success({
            sheetName: "Sheet",
            fileName: "File",
            administratorGroups: [],
            ouLabel: "Organisation unit",
            periodLabel: "Period",
            infoPlaceholder: i18n.t(
                "Thanks for downloading HMIS Tally Sheets! You can edit or hide this info message placeholder under settings options. For any questions or feedback, please contact us through the 'Send Feddback' button on the bottom right corner."
            ),
        });
    }

    update(config: Config): FutureData<Config> {
        return Future.error(new Error("Not implemented"));
    }
}
