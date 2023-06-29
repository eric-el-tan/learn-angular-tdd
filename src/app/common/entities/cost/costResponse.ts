import {NamedStaff, Staff} from "../people/staff";
import {Student} from "../people/student";
import {CasualStaff} from "../people/casualStaff";
import {DirectCost} from "../nonPeople/directCost";

export interface CostResponse{
    namedStaffs: NamedStaff[],
    unNamedStaffs: Staff[],
    students: Student[],
    casualStaff: CasualStaff[],
    directCosts: DirectCost[]
}
