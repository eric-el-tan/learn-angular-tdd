import {ConfigValue} from '../entities/config';

export class CostUtil {

    static costCategories: ConfigValue[] = [
        {
            key: '-1',
            value: 'Select a category'
        },
        {
            key: '770030',
            value: 'Accommodation Conference'
        },
        {
            key: '860050',
            value: 'Accommodation Short Haul'
        },
        {
            key: '861000',
            value: 'Accomodation Long Haul'
        },
        {
            key: '770020',
            value: 'Airfare Conference'
        },
        {
            key: '860010',
            value: 'Airfare Long Haul'
        },
        {
            key: '860015',
            value: 'Airfare Short Haul'
        },
        {
            key: '279',
            value: 'Asset Clearing Suspense'
        },
        {
            key: '760',
            value: 'Asset Costs < $5000 - EXT'
        },
        {
            key: '761',
            value: 'Asset Costs < $5000 - INT'
        },
        {
            key: '758',
            value: 'Asset Costs-Computer<$1000 EXT'
        },
        {
            key: '759',
            value: 'Asset Costs-Computer<$1000 INT'
        },
        {
            key: '770010',
            value: 'Conference Fees'
        },
        {
            key: '770040',
            value: 'Conference Running Costs'
        },
        {
            key: '770',
            value: 'Conferences - EXT'
        },
        {
            key: '771',
            value: 'Conferences - INT'
        },
        {
            key: '772',
            value: 'Consulting Fees'
        },
        {
            key: '775010',
            value: 'Consum - Animal Costs EXT'
        },
        {
            key: '776010',
            value: 'Consum - Animal Costs INT'
        },
        {
            key: '775070',
            value: 'Consum - Health & Safety EXT'
        },
        {
            key: '775',
            value: 'Consumable Supply&Service EXT'
        },
        {
            key: '776',
            value: 'Consumable Supply&Service INT'
        },
        {
            key: '785',
            value: 'Donations/Koha'
        },
        {
            key: '795',
            value: 'Hire of Equip & Facilities EXT'
        },
        {
            key: '796',
            value: 'Hire of Equip & Facilities INT'
        },
        {
            key: '798',
            value: 'Hospitality - EXT'
        },
        {
            key: '775020',
            value: 'Lab Chemicals'
        },
        {
            key: '806',
            value: 'Legal Fees'
        },
        {
            key: '860020',
            value: 'Other Fares (Boat, Train etc)'
        },
        {
            key: '810',
            value: 'Photocopy/Print Expenses EXT'
        },
        {
            key: '818',
            value: 'Post/Freight/Courier EXT'
        },
        {
            key: '820',
            value: 'Printing Publications'
        },
        {
            key: '823',
            value: 'Prizes & Scholarships INT'
        },
        {
            key: '824',
            value: 'Scholarships - Awards EXT'
        },
        {
            key: '826',
            value: 'Scholarships - Fees EXT'
        },
        {
            key: '840',
            value: 'Software - EXT'
        },
        {
            key: '730',
            value: 'Staff Catering - EXT'
        },
        {
            key: '731',
            value: 'Staff Catering - INT'
        },
        {
            key: '848010',
            value: 'Student Expenses - EXT'
        },
        {
            key: '851',
            value: 'Subcontracts - EXT'
        },
        {
            key: '850',
            value: 'Subscriptions'
        },
        {
            key: '852',
            value: 'Sundry Expenses - EXT'
        },
        {
            key: '855',
            value: 'Telecommunications - EXT'
        },
        {
            key: '860000',
            value: 'TMC Fee'
        },
        {
            key: '860060',
            value: 'Travel - Meals/Incidentals'
        },
        {
            key: '860080',
            value: 'Travel - Mileage Allowance'
        },
        {
            key: '860070',
            value: 'Travel - Parking'
        },
        {
            key: '860040',
            value: 'Travel - Taxis'
        },
        {
            key: '861',
            value: 'Travel & Accommodation - INT'
        },
        {
            key: '860',
            value: 'Travel and Accommodation - EXT'
        },
        {
            key: '860030',
            value: 'Vehicle Rentals'
        }
    ];

    static peopleCostCategories: ConfigValue[] = [
        {
            key: '700',
            value: 'ACC levy'
        },
        {
            key: '703',
            value: 'Annual Leave Expense'
        },
        {
            key: '705040',
            value: 'Staff Appointment Travel Costs'
        },
        {
            key: '705100',
            value: 'Appointment Costs INT'
        },
        {
            key: '710',
            value: 'Contracts for Service - EXT'
        },
        {
            key: '720',
            value: 'Salaries Academic - Long Term'
        },
        {
            key: '722',
            value: 'Salaries Academic - Fixed Term'
        },
        {
            key: '724',
            value: 'Professional Salaries - Long T'
        },
        {
            key: '725',
            value: 'Professional Salaries - Fixed'
        },
        {
            key: '726',
            value: 'Salaries - postdoctoral'
        },
        {
            key: '727010',
            value: 'Academic Consulting - EXT'
        },
        {
            key: '728',
            value: 'Professional Staff - Casual'
        },
        {
            key: '729',
            value: 'Professional Staff - Overtime'
        },
        {
            key: '741',
            value: 'Superannuation'
        },
        {
            key: '848',
            value: 'Student Stipends - EXT'
        },
        {
            key: '881',
            value: 'Research Surplus/ Deficits'
        },
        {
            key: '885',
            value: 'Alloc Res Contract O/H Expense'
        },
        {
            key: '619',
            value: 'Grants - Other'
        }
    ];

    static getCostCategory(value: string) {
        for (const costCategory of this.costCategories) {
            if (costCategory.value === value) {
                return costCategory.key
            }
        }
    }

    static getPeopleCostCategory(value: string) {
        for (const peopleCostCategory of this.peopleCostCategories) {
            if (peopleCostCategory.value === value) {
                return peopleCostCategory.key
            }
        }
    }
}
