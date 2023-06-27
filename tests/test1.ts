import { assert } from "chai";
import { expect } from "chai";

describe('test1', () => {

  describe('#2Array', () => {

    describe('#3Array', () => {

      context ('when having multiple results', () => {

        it('should return -1 when the value is not present', () => {
          assert.equal([1, 2, 3].indexOf(4), -1);
        });
        it('should be null', () => {
          expect(null).to.be.null;
        });
        it('should be false', () => {
          expect(false).to.be.false;
        });
        it('should be = 50', () => {
          expect(50).to.be.equal(50);
        });
        it('should be instanceOf Number', () => {
          // console.log(`${[1,2,3]}`);
          expect([1,2,3].length).to.be.instanceOf(Number);
        });

      });

      describe('#4indexOf()', () => {
        it('should return -1 when the value is not present', () => {
          assert.equal([1, 2, 3].indexOf(4), -1);
        });
      });

      describe('#4indexOf2()', () => {
        it('should return -1 when the value is not present', () => {
          assert.equal([1, 2, 3].indexOf(4), -1);
        });
      });

    });

  });

});
