/**
 * Base class for typical classes with attributes. Features: create, update.
 *
 * ```
 * class Counter extends Struct<{ id: Id; value: number }>() {
 *     add(value: number): Counter {
 *         return this._update({ value: this.value + value });
 *     }
 * }
 *
 * const counter1 = Counter.create({ id: "some-counter", value: 1 });
 * const counter2 = counter1._update({ value: 2 });
 * ```
 */

export function Struct<Attrs>() {
    abstract class Base {
        constructor(_attributes: Attrs) {
            Object.assign(this, _attributes);
        }

        _getAttributes(): Attrs {
            const entries = Object.getOwnPropertyNames(this).map(key => [key, (this as any)[key]]);
            return Object.fromEntries(entries) as Attrs;
        }

        protected _update(partialAttrs: Partial<Attrs>): this {
            const ParentClass = this.constructor as new (values: Attrs) => typeof this;
            return new ParentClass({ ...this._getAttributes(), ...partialAttrs });
        }

        static create<U extends Base>(this: new (attrs: Attrs) => U, attrs: Attrs): U {
            return new this(attrs);
        }
    }

    return Base as {
        new (values: Attrs): Attrs & Base;
        create: (typeof Base)["create"];
    };
}

const GenericStruct = Struct<unknown>();

export type GenericStructInstance = InstanceType<typeof GenericStruct>;

interface InstancesWithErrors<InstanceType> {
    instances: InstanceType[];
    errors: Error[];
}

export function filterValidInstances<Attrs, InstanceType>(
    Instance: { new (attrs: Attrs): InstanceType },
    attrs: Attrs[]
): InstancesWithErrors<InstanceType> {
    return attrs.reduce<InstancesWithErrors<InstanceType>>(
        (acc, attr) => {
            try {
                // Using .push() to avoid creating new array instances for performance
                acc.instances.push(new Instance(attr));
            } catch (e) {
                if (e instanceof Error) {
                    console.debug(e.message);
                    acc.errors.push(e);
                } else {
                    console.error("Unknown error: ", e);
                }
            }

            return acc;
        },
        { instances: [], errors: [] }
    );
}
