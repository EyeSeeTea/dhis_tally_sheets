export type Id = string;

export interface Ref {
    id: Id;
}

export interface NamedRef extends Ref {
    name: string;
}

export function getId(ref: Ref): Id {
    return ref.id;
}
