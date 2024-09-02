import { TallySheets } from "../TallySheets.js";
import { apiUrl } from "../app.js";

export const StorageFactory = TallySheets.factory("Storage", [
    "$resource",
    function ($resource) {
        return $resource(
            apiUrl + "/constants.json",
            {},
            {
                get: {
                    method: "GET",
                    params: {
                        fields: "id,code,description",
                        filter: "code:eq:TALLY_SHEETS_STORAGE",
                        paging: false,
                    },
                },
            }
        );
    },
]);
