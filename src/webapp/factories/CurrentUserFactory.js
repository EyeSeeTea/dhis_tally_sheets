import { TallySheets } from "../TallySheets.js";
import { apiUrl } from "../app.js";

export const CurrentUserFactory = TallySheets.factory("CurrentUser", [
    "$resource",
    function ($resource) {
        return $resource(
            apiUrl + "/me.json",
            {},
            {
                get: {
                    method: "GET",
                    params: {
                        fields: "id,userGroups",
                        paging: false,
                    },
                },
            }
        );
    },
]);
