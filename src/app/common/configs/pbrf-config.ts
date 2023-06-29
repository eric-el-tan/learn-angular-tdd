export class PbrfConfig {

  public static getSubCategories(selectedCategory: string) {
    return PbrfConfig.pbrf.find((category) => category.name === selectedCategory).subcategories;
  }

  public static readonly pbrf: Array<any> = [
    {
      name: '',
      subcategories: [''],
    },
    {
      name: 'Non-PBRF Eligible',
      subcategories: ['Consulting & Service Private Sector (International)', 'Consulting & Service Private Sector (NZ)', 'Internal Income'],
    },
    { name: 'NZ Government Contestable Funds',
      subcategories: ['Research Purchase Agencies'] },
    {
      name: 'NZ Non-Government Income',
      subcategories: [
        'Iwi Authorities & Organisations',
        'Charities & Charitable Trusts',
        'Endowments, Gifts To Support Research Corp. Donors & Indvdls',
        'Private Sector, Industry, Iwi Auth. & Related Org',
        'Professional Societies & Networks',
      ],
    },
    {
      name: 'NZ Public Sector Contract Research',
      subcategories: ['Cris', 'Local Government', 'Other Central Government', 'Other NZ Teos', 'Tec Or Moe (Core) Research Funding'],
    },
    {
      name: 'Overseas Research Income',
      subcategories: [
        'Charities',
        'Endowments, Gifts By Corp. Donors & Individuals',
        'Government Sources',
        'Private Sector & Industry',
        'Professional Societies / Networks',
      ],
    },
  ];

}