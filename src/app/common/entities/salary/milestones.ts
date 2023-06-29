import { DateUtil as d } from "../../utils/dateUtil";
import { BudgetDates } from "./budgetDates";
import { InflationHelper } from "./inflation";
import { PromotionHelper } from "./promotion";

export class MileStones {
	private mileStones: MileStone[] = [];

	constructor(year: number, budgetDates: BudgetDates, inflationHelper: InflationHelper, promotionHelper: PromotionHelper) {
		this.add(MileStoneType.PERIOD_START, budgetDates.getPeriodStart(year));
		this.add(MileStoneType.PERIOD_END, budgetDates.getPeriodEnd(year));
		if (inflationHelper) {
			this.add(
				MileStoneType.INFLATION,
				inflationHelper.getYearInflationDate(year)
			);
		}
		if (promotionHelper) {
			this.add(MileStoneType.PROMOTION, promotionHelper.getYearPromotionDate(year));
		}

		this.mileStones = this.mileStones.filter((milestone) => milestone !== null);
		this.mileStones = this.mileStones.sort((milestone1, milestone2) =>
			d.diffDate(
				d.toMoment(milestone1.mileStoneDate),
				d.toMoment(milestone2.mileStoneDate)
			)
		);
	}

	private add(
		mileStoneType: MileStoneType,
		mileStoneDate: string,
		ftePercent?: number
	) {
		this.mileStones.push(
			new MileStone(mileStoneType, mileStoneDate, ftePercent)
		);
	}

	getMileStones(): MileStone[] {
		return this.mileStones;
	}
}

export class MileStone {
	mileStoneType: MileStoneType;
	mileStoneDate: string;
	ftePercent?: number;

	constructor(
		mileStoneType: MileStoneType,
		mileStoneDate: string,
		ftePercent?: number
	) {
		this.mileStoneType = mileStoneType;
		this.mileStoneDate = mileStoneDate;
		this.ftePercent = ftePercent;
	}
}

export enum MileStoneType {
	PERIOD_START = "PERIOD_START",
	INFLATION = "INFLATION",
	PROMOTION = "PROMOTION",
	PERIOD_END = "PERIOD_END",
	UNKNOWN = "UNKNOWN",
}
