const Genre = require('./genre');
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	MOCK_GENRES,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('getLocal', () => {
	it('retrieves the locally saved genre with the specified api_id from the db', async () => {
		const action = await Genre.getLocal(MOCK_GENRES.action.api_id);
		expect(action).toEqual(MOCK_GENRES.action);
	});
});

describe('save', () => {
	it('saves the genre with the specified api_id & name to the local db', async () => {
		const romance = await Genre.save(789, 'romance');
		expect(romance).toEqual({
			api_id: 789,
			name: 'romance',
			id: expect.any(Number),
		});
		expect(await Genre.getLocal(789)).toEqual(romance);
	});
});
