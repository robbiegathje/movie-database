const getNestedProperty = require('./getNestedProperty');

const MOCK = {
	company: {
		name: 'company.name',
		employees: {
			president: { name: 'president.name', age: 43, experience: 23 },
			cto: { name: 'cto.name', age: 41, experience: 18 },
		},
	},
};

describe('getNestedProperty', () => {
	it('is a function', () => {
		expect(typeof getNestedProperty).toBe('function');
	});

	it('returns the value of the requested nested property', () => {
		expect(getNestedProperty(MOCK, 'company.employees.president.name')).toBe(
			MOCK.company.employees.president.name
		);
		expect(getNestedProperty(MOCK, 'company.employees.cto.experience')).toBe(
			MOCK.company.employees.cto.experience
		);
		expect(getNestedProperty(MOCK, 'company.name')).toBe(MOCK.company.name);
	});

	it('returns undefined whenever any of the requested properties do not exist', () => {
		expect(getNestedProperty(MOCK, 'company.name.public')).toBe(undefined);
		expect(getNestedProperty(MOCK, 'company.staff.cfo.age')).toBe(undefined);
	});

	it('returns undefined whenever the first argument is not an object', () => {
		expect(getNestedProperty('blah', 'anything.at.all')).toBe(undefined);
		expect(
			getNestedProperty(['blah', 'blah', 'blah', 1, 2, 3], 'anything.at.all')
		).toBe(undefined);
	});
});
