import { FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import { User } from "$/domain/entities/User";

export interface UserRepository {
    getCurrent(options?: { adminGroups: Id[] }): FutureData<User>;
}
