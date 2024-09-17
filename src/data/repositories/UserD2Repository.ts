import { User } from "$/domain/entities/User";
import { UserRepository } from "$/domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import _c from "$/domain/entities/generic/Collection";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api) {}

    public getCurrent(authorizationGroups = { adminGroups: [] as Id[] }): FutureData<User> {
        return apiToFuture(
            this.api.currentUser.get({
                fields: userFields,
            })
        ).map(d2User => this.buildUser(d2User, authorizationGroups.adminGroups));
    }

    private buildUser(d2User: D2User, adminGroups: Id[]): User {
        const userBelongsToSomeAdminGroup = d2User.userGroups.some(group =>
            adminGroups.includes(group.id)
        );

        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            authorizations: { canSelectAllLocales: userBelongsToSomeAdminGroup },
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
    organisationUnits: { id: true, name: true, displayName: true, path: true, level: true },
} as const;

type D2User = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number] & {
    settings: {
        keyUiLocale: string;
    };
};
