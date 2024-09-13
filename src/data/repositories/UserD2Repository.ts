import { User } from "$/domain/entities/User";
import { UserRepository } from "$/domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { array, Codec, string } from "purify-ts";
import _c from "$/domain/entities/generic/Collection";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api) {}

    public getCurrent(): FutureData<User> {
        const administratorGroups$ = apiToFuture(
            this.api.models.constants.get({
                fields: constantFields,
                filter: { code: { eq: "TALLY_SHEETS_STORAGE" } },
                paging: false,
            })
        ).map(res => {
            const description = _c(res.objects).first()?.description;

            /* To pass beside not having the constant or not being valid */
            if (description) {
                return constantDescriptionCodec.decode(JSON.parse(description)).caseOf({
                    Left: _err => {
                        console.error(new Error(constantsErrMsg));
                        return [];
                    },
                    Right: res => res.administratorGroups,
                });
            } else {
                console.error(new Error(constantsErrMsg));
                return [];
            }
        });

        const d2User$ = apiToFuture(
            this.api.currentUser.get({
                fields: userFields,
            })
        );

        return d2User$.chain(d2User =>
            administratorGroups$.map(adminGroups => this.buildUser(d2User, adminGroups))
        );
    }

    private buildUser(d2User: D2User, adminGroups: string[]) {
        const userBelongsToSomeAdminGroup = d2User.userGroups.some(group =>
            adminGroups.includes(group.id)
        );

        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            canSelectAllLocales: userBelongsToSomeAdminGroup,
            preferredLocale: d2User.settings.keyUiLocale,
            organisationUnits: d2User.organisationUnits,
            ...d2User.userCredentials,
        });
    }
}

const userFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    userCredentials: {
        username: true,
        userRoles: { id: true, name: true, authorities: true },
    },
    settings: {
        keyUiLocale: true,
    },
    organisationUnits: { id: true, name: true, displayName: true, path: true },
} as const;

const constantFields = {
    id: true,
    code: true,
    description: true,
} as const;

const constantDescriptionCodec = Codec.interface({ administratorGroups: array(string) });
const constantsErrMsg =
    "Unable to retrieve if the user is Admin (can select all languages). The TALLY_SHEETS_STORAGE description is not a valid JSON object.";

type D2User = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number] & {
    settings: {
        keyUiLocale: string;
    };
};
