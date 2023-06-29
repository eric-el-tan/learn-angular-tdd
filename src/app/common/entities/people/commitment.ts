export class Commitment {
	commitment: number;
	startDate: string;
	endDate: string;

	constructor(
		commitment: number,
		startDate: string,
		endDate: string
	) {
		this.commitment = commitment;
		this.startDate = startDate;
		this.endDate = endDate;
	}
}