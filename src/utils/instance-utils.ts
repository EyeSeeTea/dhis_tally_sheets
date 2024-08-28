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
                acc.instances.push(new Instance(attr)); // Using .push() to avoid creating new array instances for performance
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
