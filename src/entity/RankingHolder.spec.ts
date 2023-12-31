import { expect } from "chai";
import { RankingHolder } from "./RankingHolder";

describe('RankingHolder', () => {

  describe('average', () => {

    let instance: RankingHolder;
    let str1: string;
    let startTime: number = new Date().getMilliseconds();

    beforeEach(() => {
      instance = new RankingHolder();
      str1 = "str1";
      // console.log(`beforeEach ${str1}`);
    });

    afterEach(() => {
      instance = new RankingHolder();
      str1 = "end of str1";
      let endTime: number = new Date().getMilliseconds();
      console.log(`time spend: ${endTime - startTime} ms`);
    });

    context('when having no result', () => {
      it("should return null", () => {
          expect(instance.average).to.be.null;
          expect(null).to.be.null;
      });
      it("should return 'str1'", () => {
          expect(str1).to.be.equals("str1");
      });
    });

    context('when having multiple results', () => {
      it("should return 50 if a result with score 50 is added", () => {
          instance.add({ name: "Yuto", score: 50 });
          expect(instance.average).to.equal(50);
      });

      it("should return 55 when adding 40, 50, 60 and 70", () => {
          instance.add({ name: "Yuto", score: 40 });
          instance.add({ name: "Yuto2", score: 50 });
          instance.add({ name: "Yuto3", score: 60 });
          instance.add({ name: "Yuto4", score: 70 });
          expect(instance.average).to.equal(55);
      });

      it("should return -2 when adding -6, and 2", () => {
          instance.add({ name: "Yuto", score: -6 });
          instance.add({ name: "Yuto2", score: 2 });
          expect(instance.average).to.equal(-2);
      });
    });

  });

});
