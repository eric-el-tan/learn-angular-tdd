import { DateUtil as d } from 'src/app/common/utils/dateUtil';

export class BudgetDates {
	budgetStartDate!: string;
	budgetEndDate!: string;
	commitStartDate!: string;
	promotionDate!: string;

	constructor(
		budgetStartDate: string,
		budgetEndDate: string,
		commitStartDate: string,
		promotionDate: string
	) {
		this.budgetStartDate = budgetStartDate;
		this.budgetEndDate = budgetEndDate;
		this.commitStartDate = commitStartDate;
		this.promotionDate = promotionDate;
	}

	get budgetPeriod(): number {
		return d.getYear(this.budgetEndDate) - d.getYear(this.budgetStartDate) + 1;
	}
	get startYear(): number {
		return d.getYear(this.budgetStartDate);
	}
	get endYear(): number {
		return d.getYear(this.budgetEndDate);
	}

	getPeriodStart(year: number): string {
		return year === this.startYear ? this.commitStartDate : `${year}-01-01`;
	}
	getPeriodEnd(year: number): string {
		return year === this.endYear ? this.budgetEndDate : `${year}-12-31`;
	}
}
