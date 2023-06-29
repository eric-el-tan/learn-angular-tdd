export class GlCodeConfig {

  static readonly OPEX: string = 'OPEX';
  static readonly CAPEX: string = 'CAPEX';

  public static getExpenditures(): string[] {
    return GlCodeConfig.expenditures;
  }

  public static getPeopleCostGlCode(): string[] {
    return GlCodeConfig.peopleCostGlCode.map(i => i.code + ' - ' + i.description);
  }

  public static getDirectCostGlCode(): any[] {
    return GlCodeConfig.directCostGlCode.map(i => {
      let json = {
        code: i.code,
        description: i.code + ' - ' + i.description,
      };
      return json; 
    });
  }

  public static getExpenditureType(code: string) : string {
    let expenditureType: string = GlCodeConfig.directCostGlCode.find(i => i.code == code)?.expenditureType;
    console.log(`code ${code}, expenditureType: ${expenditureType}`);
    return expenditureType;
  }

  public static readonly expenditures: Array<any> = [
    { code: 'OPEX', description: 'OPEX'},
    { code: 'CAPEX', description: 'CAPEX'},
  ];

  public static readonly directCostGlCode: Array<any> = [
    { code: '861000', description: 'Accommodation Long Haul', expenditureType: GlCodeConfig.OPEX},
    { code: '705', description: 'Appointment Costs', expenditureType: GlCodeConfig.OPEX},
    { code: '760', description: 'Asset Costs < $5000 - EXT', expenditureType: GlCodeConfig.CAPEX},
    { code: '758', description: 'Asset Costs-Computer<$1000 EXT', expenditureType: GlCodeConfig.CAPEX},
    { code: '759', description: 'Asset Costs-Computer<$1000 INT', expenditureType: GlCodeConfig.CAPEX},
    { code: '279', description: 'Computer equipment greater than $1K', expenditureType: GlCodeConfig.OPEX},
    { code: '770', description: 'Conferences - EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '772', description: 'Consulting Fees', expenditureType: GlCodeConfig.OPEX},
    { code: '775', description: 'Consumable Supply&Service EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '795', description: 'Hire of Equip & Facilities EXTERNAL', expenditureType: GlCodeConfig.OPEX},
    { code: '796', description: 'Hire of Equip & Facilities INTERNAL', expenditureType: GlCodeConfig.OPEX},
    { code: '798', description: 'Hospitality - EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '806', description: 'Legal Costs', expenditureType: GlCodeConfig.OPEX},
    { code: '810', description: 'Photocopy/Print Expenses EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '820', description: 'Publications', expenditureType: GlCodeConfig.OPEX},
    { code: '818', description: 'Shipping / courier /postage', expenditureType: GlCodeConfig.OPEX},
    { code: '840', description: 'Software - EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '848010', description: 'Student Expenses - EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '850', description: 'Subscriptions', expenditureType: GlCodeConfig.OPEX},
    { code: '852', description: 'Sundry Expenses - EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '855', description: 'Telecommunications - EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '860', description: 'Travel and Accommodation - EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '0', description: 'DETAILED GL CODEs BELOW', expenditureType: ''},
    { code: '770010', description: 'Conference Fees', expenditureType: GlCodeConfig.OPEX},
    { code: '770020', description: 'Airfare Conference', expenditureType: GlCodeConfig.OPEX},
    { code: '770030', description: 'Accommodation Conference', expenditureType: GlCodeConfig.OPEX},
    { code: '770040', description: 'Conference Running Costs', expenditureType: GlCodeConfig.OPEX},
    { code: '775010', description: 'Consumables - Animal Costs EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '775020', description: 'Lab Chemicals', expenditureType: GlCodeConfig.OPEX},
    { code: '775070', description: 'Consum - Health & Safety EXT', expenditureType: GlCodeConfig.OPEX},
    { code: '860010', description: 'Airfare Long Haul', expenditureType: GlCodeConfig.OPEX},
    { code: '860015', description: 'Airfare Short Haul', expenditureType: GlCodeConfig.OPEX},
    { code: '860020', description: 'Other Fares (Boat, Train etc)', expenditureType: GlCodeConfig.OPEX},
    { code: '860030', description: 'Vehicle Rentals', expenditureType: GlCodeConfig.OPEX},
    { code: '860040', description: 'Travel - Taxis', expenditureType: GlCodeConfig.OPEX},
    { code: '860050', description: 'Accommodation Short Haul', expenditureType: GlCodeConfig.OPEX},
    { code: '860060', description: 'Travel - Meals/Incidentals', expenditureType: GlCodeConfig.OPEX},
    { code: '860070', description: 'Travel - Parking', expenditureType: GlCodeConfig.OPEX},
    { code: '860080', description: 'Travel - Mileage Allowance', expenditureType: GlCodeConfig.OPEX},
  ];

  private static readonly peopleCostGlCode: Array<any> = [
    { code:'700', description: 'ACC levy', expenditureType: GlCodeConfig.OPEX},
    { code:'703', description: 'Annual Leave Expense', expenditureType: GlCodeConfig.OPEX},
    { code:'705040', description: 'Staff Appointment Travel Costs', expenditureType: GlCodeConfig.OPEX},
    { code:'705100', description: 'Appointment Costs INT', expenditureType: GlCodeConfig.OPEX},
    { code:'710', description: 'Contracts for Service - EXT', expenditureType: GlCodeConfig.OPEX},
    { code:'720', description: 'Salaries Academic - Long Term', expenditureType: GlCodeConfig.OPEX},
    { code:'722', description: 'Salaries Academic - Fixed Term', expenditureType: GlCodeConfig.OPEX},
    { code:'724', description: 'Professional Salaries - Long T', expenditureType: GlCodeConfig.OPEX},
    { code:'725', description: 'Professional Salaries - Fixed', expenditureType: GlCodeConfig.OPEX},
    { code:'726', description: 'Salaries - postdoctoral', expenditureType: GlCodeConfig.OPEX},
    { code:'727010', description: 'Academic Consulting - EXT', expenditureType: GlCodeConfig.OPEX},
    { code:'728', description: 'Professional Staff - Casual', expenditureType: GlCodeConfig.OPEX},
    { code:'729', description: 'Professional Staff - Overtime', expenditureType: GlCodeConfig.OPEX},
    { code:'741', description: 'Superannuation', expenditureType: GlCodeConfig.OPEX},
    { code:'848', description: 'Student Stipends - EXT', expenditureType: GlCodeConfig.OPEX},
    { code:'881', description: 'Research Surplus/ Deficits', expenditureType: GlCodeConfig.OPEX},
    { code:'885', description: 'Alloc Res Contract O/H Expense', expenditureType: GlCodeConfig.OPEX},
    { code:'619', description: 'Grants - Other', expenditureType: GlCodeConfig.OPEX},
  ];
}