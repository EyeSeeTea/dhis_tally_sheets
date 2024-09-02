import { TallySheets } from "../TallySheets.js";
import { apiUrl } from "../app.js";

export const UserGroupsFactory = TallySheets.factory("UserGroups", [
    "$resource",
    function ($resource) {
        return $resource(
            apiUrl + "/userGroups.json",
            {},
            {
                get: {
                    method: "GET",
                    params: {
                        fields: "id",
                        paging: false,
                    },
                },
            }
        );
    },
]);
