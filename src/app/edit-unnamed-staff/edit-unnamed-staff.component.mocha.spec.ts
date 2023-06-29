import { UnnamedStaffData } from './../common/data/unnamed-staff.data';
import { BudgetData } from './../common/data/budget.data';
import { Inflation, InflationHelper } from './../common/entities/salary/inflation';
import { expect } from "chai";
import { Budget } from '../common/entities/project';
import { DateUtil as d} from '../common/utils/dateUtil';
import { Staff } from '../common/entities/people/staff';

describe('RSM-2897 generateInflationPeriod', () => {

  describe('inflationDates', () => {

    let str1: string;
    let startTime: number = new Date().getMilliseconds();

    beforeEach(() => {
      str1 = "str1";
    });

    afterEach(() => {
      str1 = "end of str1";
      let endTime: number = new Date().getMilliseconds();
      console.log(`time spend: ${endTime - startTime} ms`);
    });

    context('when inputs are validate', () => {
      it("should return array of Inflation", () => {

        let maxSalaryChangePct: number = 4.5;
        let budget: Budget = BudgetData.budget_2897;
        let unnamedStaff1: Staff = UnnamedStaffData.unnamedStaff_2897;

        let inflationDates: Inflation[] = new InflationHelper(1, 2, maxSalaryChangePct, 1, 11).generateInflationPeriod(
          d.today(),
          budget.budgetEndDate,
          unnamedStaff1
        );
          expect(inflationDates).not.to.be.null;
      });
      it("should return 'str1'", () => {
          expect(str1).to.be.equals("str1");
      });
    });

  });

});
