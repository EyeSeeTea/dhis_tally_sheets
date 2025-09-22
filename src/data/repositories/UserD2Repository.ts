import { User } from "$/domain/entities/User";
import { UserRepository } from "$/domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import { PartialBy } from "$/utils/ts-utils";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api) {}

    public getCurrent(options = { adminGroups: [] as Id[] }): FutureData<User> {
        return apiToFuture(
            this.api.currentUser.get({
                fields: userFields,
            })
        ).map(d2User => this.buildUser(d2User, options.adminGroups));
    }

    private buildUser(d2User: D2User, adminGroups: Id[]): User {
        const userBelongsToSomeAdminGroup = d2User.userGroups.some(group =>
            adminGroups.includes(group.id)
        );

        const username = d2User.userCredentials?.username ?? d2User.username;
        const userRoles = d2User.userCredentials?.userRoles ?? d2User.userRoles;

        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            authorizations: { canSelectAllLocales: userBelongsToSomeAdminGroup },
            preferredLocale: d2User.settings.keyUiLocale,
            organisationUnits: d2User.organisationUnits,
            username,
            userRoles,
        });
    }
}

const userFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    username: true,
    userRoles: { id: true, name: true, authorities: true },
    userCredentials: {
        username: true,
        userRoles: { id: true, name: true, authorities: true },
    },
    settings: {
        keyUiLocale: true,
    },
    organisationUnits: { id: true, name: true, displayName: true, path: true, level: true },
} as const;

type D2BaseUser = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number];

// updating userCredentials to optional as it will not be present in DHIS2 v2.42+
type D2User = PartialBy<D2BaseUser, "userCredentials"> & {
    settings: {
        keyUiLocale: string;
    };
};
