export class FunderConfig {

  public static getFundingMaximumAmt(selectedFundingRoundName: String): number {
    return FunderConfig.fundingRoundNameMap.find((item) => item.fundingRoundName == selectedFundingRoundName)?.fundingMaximumAmt;
  }

  public static getProjectPeriod(selectedFundingRoundName: String): number {
    return FunderConfig.fundingRoundNameMap.find((item) => item.fundingRoundName == selectedFundingRoundName)?.projectPeriod;
  }

  public static getFund(selectedFunderName: String): string[] {
    return FunderConfig.funder.find((item) => item.funderName == selectedFunderName)?.fund;
  }

  public static getFundingRoundName(selectedFunderName: String): string[] {
    return FunderConfig.funder.find((item) => item.funderName == selectedFunderName)?.fundingRoundNames;
  }

  public static getFundingRoundNameByFund(selectedFund: String): string[] {
    return FunderConfig.funder.find((item) => item.fund[0] == selectedFund)?.fundingRoundNames;
  }

  public static readonly funder: Array<any> = [
    { 
      funderName: 'AMRF',
      fund: ['AMRF'],
      fundingRoundNames: ['Standard'],
    },
    { 
      funderName: 'Health Research Council of New Zealand',
      fund: ['Career Development Awards','Programmes','Projects'],
      fundingRoundNames: ['All', 'General', 'General - Sir Charles Hercus Health Research Fellowship', 'Pacific Health'],
    },
    { 
      funderName: 'HRC',
      fund: ['HRC'],
      fundingRoundNames: ['Standard'],
    },
    { 
      funderName: 'MBIE',
      fund: ['MBIE'],
      fundingRoundNames: ['Standard'],
    },
    { 
      funderName: 'Ministry of Business, Innovation and Employment',
      fund: ['Endeavour','Vision Mātauranga Capability Fund (VMCF) Te Pūnaha Hihiko'],
      fundingRoundNames: ['Research Programmes','Smart Ideas','Default'],
    },
    { 
      funderName: 'Royal Society of New Zealand',
      fund: ['Marsden','Rutherford Discovery Fellowships', 'Rutherford Foundation'],
      fundingRoundNames: ['Council Award', 'Default', 'Fast Start', 'Postdoctoral Fellowship', 'Standard'],
    },
    { 
      funderName: 'University of Auckland',
      fund: ['Default','Foundation','Medical Foundation'],
      fundingRoundNames: ['Default','External Funding'],
    },
  ];

  private static readonly fundingRoundNameMap: Array<any> = [
    { 
      fundingRoundName: 'AMRF',
      fundingMaximumAmt: 999999,
      projectPeriod: 2,
    },
    { 
      fundingRoundName: 'HRC',
      fundingMaximumAmt: 888888,
      projectPeriod: 0,
    },
    { 
      fundingRoundName: 'MBIE',
      fundingMaximumAmt: 777777,
      projectPeriod: 3,
    },
    { 
      fundingRoundName: 'Marsden Fast Start',
      fundingMaximumAmt: 666666,
      projectPeriod: 3,
    },
    { 
      fundingRoundName: 'Marsden Standard',
      fundingMaximumAmt: 555555,
      projectPeriod: 3,
    },
  ];
}