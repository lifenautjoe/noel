import DummyClass from '../src/noel';

/**
 * Dummy test
 */
describe('Dummy test', () => {
    it('works if true is truthy', () => {
        expect(true).toBeTruthy();
    });

    it('DummyClass is instantiable', () => {
        expect(new DummyClass()).toBeInstanceOf(DummyClass);
    });
});
