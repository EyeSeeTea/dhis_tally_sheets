import { expect, test } from "vitest";
import { Struct } from "$/domain/entities/generic/Struct";

class Person extends Struct<{ name: string; age: number }>() {
    description() {
        return `${this.name} has ${this.age} years`;
    }

    changeName(name: string) {
        return this._update({ name });
    }
}

const mary = new Person({ name: "Mary Cassatt", age: 54 });
const john = Person.create({ name: "John", age: 30 });

test("public attributes", () => {
    expect(mary.name).toEqual("Mary Cassatt");
    expect(mary.age).toEqual(54);
});

test("public custom methods", () => {
    expect(mary.description()).toEqual("Mary Cassatt has 54 years");
});

test("constructor should return an instance of the class", () => {
    expect(mary).toBeInstanceOf(Person);
});

test("static method create should return an instance of the class", () => {
    expect(john).toBeInstanceOf(Person);
});

test("update method should not update the instance", () => {
    const marie = mary.changeName("Marie Curie");

    expect(mary.name).toBe("Mary Cassatt");
    expect(mary.name).not.toBe("Marie Curie");
    expect(marie.name).toEqual("Marie Curie");
});

test("update method should return a new instance different than the previous one", () => {
    const rose = mary.changeName("Marie Curie");

    expect(mary).not.toBe(rose);
});
