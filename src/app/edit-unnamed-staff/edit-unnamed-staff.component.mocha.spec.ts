import { UnnamedStaffData } from './../common/data/unnamed-staff.data';
import { BudgetData } from './../common/data/budget.data';
import { Inflation, InflationHelper } from './../common/entities/salary/inflation';
import { expect } from "chai";
import { Budget } from '../common/entities/project';
import { DateUtil as d} from '../common/utils/dateUtil';
import { Staff } from '../common/entities/people/staff';

describe('RSM-2897 inflationDates.generateInflationPeriod', () => {

  let inflationDates: Inflation[] = [];

  describe('on future', () => {

    let startTime: number = new Date().getMilliseconds();

    before(() => {

      let maxSalaryChangePct: number = 4.5;
      let budget: Budget = BudgetData.budget_2897;
      let unnamedStaff1: Staff = UnnamedStaffData.unnamedStaff_2897;

      inflationDates = new InflationHelper(1, 2, maxSalaryChangePct, 1, 11).generateInflationPeriod(
        d.today(),
        budget.budgetEndDate,
        unnamedStaff1
      );
    });

    after(() => {
      let endTime: number = new Date().getMilliseconds();
      console.log(`time spend: ${endTime - startTime} ms`);
    });

    context('when inputs are valid', () => {

      it("should return an array of Inflation", () => {

        expect(inflationDates).not.to.be.null;
        expect(inflationDates).to.be.an('array');
        expect(inflationDates).to.have.lengthOf.above(0);
        expect(inflationDates)
          .to.be.an.instanceof(Array)
          .and.to.have.lengthOf.above(0)
          .and.to.have.length(6);
      });

      it("should return 6 objects of Inflation", () => {
        expect(inflationDates).to.have.length(6);
        expect(inflationDates[0]).to.have.property('inflationDate');
        expect(inflationDates[0]).to.have.property('incrementPercent');
      });

      it("should return 6 objects of Inflation 2", () => {
        for (let i=0; i < 6; i++) {
          expect(inflationDates[i])
            .that.includes.all.keys(['inflationDate', 'incrementPercent']);
        }
      });

      it("data type example", () => {
        expect('inflationDates').to.be.an('string');
        expect(123).to.be.an('number');
        expect(123.23).to.be.an('number');
        expect(true).to.be.an('boolean');
        expect(null).to.be.null;
      });

    });

  });

});
