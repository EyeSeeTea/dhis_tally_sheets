export type Id = string;

export interface Ref {
    id: Id;
}

export interface NamedRef extends Ref {
    name: string;
}

export function getId<Obj extends Ref>(obj: Obj): Id {
    return obj.id;
}
