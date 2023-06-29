import * as exceljs from 'exceljs'
import * as fs from 'file-saver';
import {ProjectRole} from '../entities/project';
import {CostUtil} from './costUtil';
import {CommittedSalary} from '../entities/people/staff';
import {cloneDeep} from 'lodash'

export function downloadSummaryExcel(project, budget, staffs, students, directCosts, subcontracts, contractsForService) {
console.log(project)
    console.log(budget)
    // Excel file details
    const workbook = new exceljs.Workbook();
    workbook.creator = 'Tahua Rangahau';
    workbook.lastModifiedBy = 'Tahua Rangahau';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Create worksheet for project data
    const projectDataWorksheet = workbook.addWorksheet('Project Data', {views: [{showGridLines: false}]});

    // Create project data table
    let currentRow = 1;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Project Number';
    if (project.projectCode) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.projectCode;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Project Name';
    if (project.projectName) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.projectName;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Principal Investigator';
    if (project.principalInvestigator) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.principalInvestigator;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Faculty / Institute';
    if (project.faculty) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.faculty;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'PBRF Category';
    if (project.pbrfCategory) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.pbrfCategory;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'PBRF Sub-Category';
    if (project.pbrfSubCategory) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.pbrfSubCategory;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Home Department';
    if (project.homeDepartment) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.homeDepartment;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Funder Account Code (Research Centre Affilliation)';
    if (project.researchCentreAffiliation) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.researchCentreAffiliation;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Funder';
    if (project?.funderRule?.funderName) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.funderRule.funderName;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Fund';
    if (project?.funderRule?.fund) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.funderRule.fund;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Funding round';
    if (project?.funderRule?.fundingRoundName) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.funderRule.fundingRoundName;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Funder rule';
    if (project.funderRule?.ruleName) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.funderRule.ruleName;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Maximum amount';
    if (project.fundingMaximumAmt) {
        projectDataWorksheet.getCell(currentRow, 2).value = project.fundingMaximumAmt;
        projectDataWorksheet.getCell(currentRow, 2).numFmt = '$ #,##0.00';
        projectDataWorksheet.getCell(currentRow, 2).alignment = { horizontal: 'left' };
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Associate Investigator';
    const associateInvestigator = getRole(project.projectRoles, 'associateInvestigator');
    if (associateInvestigator) {
        projectDataWorksheet.getCell(currentRow, 2).value = associateInvestigator.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = associateInvestigator.staffUpi;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Co-Principal Investigator';
    const coPrincipalInvestigator = getRole(project.projectRoles, 'coPrincipalInvestigator');
    if (coPrincipalInvestigator) {
        projectDataWorksheet.getCell(currentRow, 2).value = coPrincipalInvestigator.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = coPrincipalInvestigator.staffUpi;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Project Manager';
    const projectManager = getRole(project.projectRoles, 'projectManager');
    if (projectManager) {
        projectDataWorksheet.getCell(currentRow, 2).value = projectManager.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = projectManager.staffUpi;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Portfolio Lead';
    const portfolioLead = getRole(project.projectRoles, 'portfolioLead');
    if (portfolioLead) {
        projectDataWorksheet.getCell(currentRow, 2).value = portfolioLead.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = portfolioLead.staffUpi;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Financial Approver';
    const financialApprover = getRole(project.projectRoles, 'financialApprover');
    if (financialApprover) {
        projectDataWorksheet.getCell(currentRow, 2).value = financialApprover.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = financialApprover.staffUpi;
    }
    // currentRow++;
    // projectDataWorksheet.getCell(currentRow, 1).value = 'Contract Manager';
    // const contractManager = getRole(project.projectRoles, 'contractManager');
    // if (contractManager) {
    //     projectDataWorksheet.getCell(currentRow, 2).value = contractManager.nameDisplay;
    //     projectDataWorksheet.getCell(currentRow, 3).value = contractManager.staffUpi;
    //}
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Research Services Manager';
    const researchServicesManager = getRole(project.projectRoles, 'researchServicesManager');
    if (researchServicesManager) {
        projectDataWorksheet.getCell(currentRow, 2).value = researchServicesManager.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = researchServicesManager.staffUpi;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Research Programme Manager';
    const researchProgrammeManager = getRole(project.projectRoles, 'researchProgrammeManager');
    if (researchProgrammeManager) {
        projectDataWorksheet.getCell(currentRow, 2).value = researchProgrammeManager.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = researchProgrammeManager.staffUpi;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Research Programme Coordinator';
    const researchProgrammeCoordinator = getRole(project.projectRoles, 'researchProgrammeCoordinator');
    if (researchProgrammeCoordinator) {
        projectDataWorksheet.getCell(currentRow, 2).value = researchProgrammeCoordinator.nameDisplay;
        projectDataWorksheet.getCell(currentRow, 3).value = researchProgrammeCoordinator.staffUpi;
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Project Start Date for Submission';
    if (budget.budgetStartDate) {
        projectDataWorksheet.getCell(currentRow, 2).value = convertDateString(budget.budgetStartDate)
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Project End Date for Submission';
    if (budget.budgetEndDate) {
        projectDataWorksheet.getCell(currentRow, 2).value = convertDateString(budget.budgetEndDate)
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Project Start Date for Activation';
    if (budget.budgetActivationStartDate) {
        projectDataWorksheet.getCell(currentRow, 2).value = convertDateString(budget.budgetActivationStartDate)
    }
    currentRow++;
    projectDataWorksheet.getCell(currentRow, 1).value = 'Project End Date for Activation';
    if (budget.budgetActivationEndDate) {
        projectDataWorksheet.getCell(currentRow, 2).value = convertDateString(budget.budgetActivationEndDate)
    }
    for (let i = 1; i < currentRow + 1; i++) {
        for (let j = 1; j < 4; j++) {
            projectDataWorksheet.getCell(i, j).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
        }
    }

    // Adjust column widths
    projectDataWorksheet.columns[0].width = 47 + 0.62;
    projectDataWorksheet.columns[1].width = 66 + 0.62;
    projectDataWorksheet.columns[2].width = 9 + 0.62;

    // Funder Table
    currentRow = 3;
    const worksheet = workbook.addWorksheet('Budget Summary', {views: [{showGridLines: false}]});
    worksheet.addRow([]);
    worksheet.addRow(['', 'Budget Summary', '', '']);
    worksheet.addRow(['', 'Project Name', '', '']);
    if (project.projectName) {
        worksheet.getCell(currentRow, 3).value = project.projectName;
    }
    currentRow++;
    worksheet.addRow(['', 'Principal Investigator', '', '']);
    if (project.principalInvestigator) {
        worksheet.getCell(currentRow, 3).value = project.principalInvestigator;
    }
    currentRow++;
    worksheet.addRow(['', 'Client / Funder', '', '']);
    if (project.funderRule?.funderName) {
        worksheet.getCell(currentRow, 3).value = project.funderRule.funderName;
    }
    currentRow++;
    worksheet.addRow(['', 'Project Start Date for Submission', '', '']);
    if (budget.budgetStartDate) {
        worksheet.getCell(currentRow, 3).value = convertDateString(budget.budgetStartDate)
    }
    currentRow++;
    worksheet.addRow(['', 'Project End Date for Submission', '', '']);
    if (budget.budgetEndDate) {
        worksheet.getCell(currentRow, 3).value = convertDateString(budget.budgetEndDate)
    }
    currentRow++;
    worksheet.addRow(['', 'Project Start Date for Activation', '', '']);
    if (budget.budgetActivationStartDate) {
        worksheet.getCell(currentRow, 3).value = convertDateString(budget.budgetActivationStartDate)
    }
    currentRow++;
    worksheet.addRow(['', 'Project End Date for Activation', '', '']);
    if (budget.budgetActivationEndDate) {
        worksheet.getCell(currentRow, 3).value = convertDateString(budget.budgetActivationEndDate)
    }
    for (let i = 2; i < currentRow + 1; i++) {
        for (let j = 2; j < 4; j++) {
            worksheet.getCell(i, j).font = { bold: true };
        }
        for (let j = 2; j < 4; j++) {
            worksheet.getCell(i, j).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
        }
    }
    worksheet.addRow([]);
    worksheet.addRow([]);
    currentRow = currentRow + 3;
    const columnCount = 6;
    const staff = [];
    const casualStaff = [];
    for (const staffEntry of staffs) {
        if (staffEntry.peopleType === 'Casual') {
            casualStaff.push(staffEntry)
        }
        else {
            staff.push(staffEntry)
        }
    }
    staff.sort((a, b) => {
        const priorityA = getPriority(a);
        const priorityB = getPriority(b);
        return priorityA - priorityB;
    });
    let projectPeriodCount = 1;
    let startDate;
    let endDate;
    const periodHeader = [];

    let dateOffset: number;
    if (budget.budgetActivationStartDate) {
        dateOffset = getDateDiff(budget.budgetStartDate, budget.budgetActivationStartDate);
    } else {
        dateOffset = 0
    }

    for (const budgetPeriod of budget.budgetPeriods) {
        startDate = addDays(budgetPeriod.startDate, dateOffset);
        endDate = addDays(budgetPeriod.endDate, dateOffset);
        periodHeader.push('Y' + projectPeriodCount + ' (' + startDate +
            ' - ' + endDate + ')');
        periodHeader.push('', '', '', '', '');
        projectPeriodCount++;
    }
    projectPeriodCount = projectPeriodCount - 1;
    const costPeriodGrandTotals = [];
    for (let i = 0; i < projectPeriodCount + 1; i++) {
        costPeriodGrandTotals.push(0);
    }
    if (0 < staff.length) {
        const staffCount = staff.length;
        let salaryHeader = ['', 'Staff', ''];
        salaryHeader = salaryHeader.concat(periodHeader);
        salaryHeader.push('Project Summary');
        const salaryHeader2 = ['', '', 'Level'];
        for (let i = 0; i < projectPeriodCount; i++) {
            salaryHeader2.push('Base Salary', 'Overheads', 'ACC', 'Superannuation', '', 'Total');
        }
        salaryHeader2.push('Base Salary', 'Overheads', 'ACC', 'Superannuation', '', 'Total');
        worksheet.addRow(salaryHeader);
        worksheet.addRow(salaryHeader2);
        let salary;
        let acc;
        let superannuation;
        let overhead;
        let resultValue;
        for (let i = 0; i < staffCount; i++) {
            worksheet.getCell(i + currentRow + 2, 2).value = staff[i].nameDisplay;
            worksheet.getCell(i + currentRow + 2, 3).value = staff[i].titleDisplay;
            for (let j = 0; j < projectPeriodCount; j++) {
                salary = 0;
                if (staff[i].allowanceMap != null && j < staff[i].allowanceMap.length) {
                    salary = salary + staff[i].allowanceMap[j].value;
                }
                if (staff[i].salaryMap != null && j < staff[i].salaryMap.length) {
                    salary = salary + staff[i].salaryMap[j].value;
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 4).value = salary;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 4).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (staff[i].overheadMap != null && j < staff[i].overheadMap.length) {
                    overhead = staff[i].overheadMap[j].value;
                } else {
                    overhead = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 5).value = overhead;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 5).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (staff[i].accMap != null && j < staff[i].accMap.length) {
                    acc = staff[i].accMap[j].value;
                } else {
                    acc = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 6).value = acc;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 6).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (staff[i].superannuationMap  && j < staff[i].superannuationMap.length) {
                    superannuation = staff[i].superannuationMap[j].value;
                } else {
                    superannuation = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 7).value = superannuation;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 7).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                worksheet.getCell(i + currentRow + 2, j * columnCount + 9).value = salary + acc + superannuation + overhead;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
            }
            for (let j = 0; j < columnCount; j++) {
                if (j !== 4) {
                    resultValue = 0;
                    for (let k = 0; k < projectPeriodCount; k++) {
                        resultValue = resultValue + worksheet.getCell(currentRow + 2 + i, k * columnCount + 4 + j).value;
                    }
                    worksheet.getCell(i + currentRow + 2, projectPeriodCount * columnCount + 4 + j).value =  resultValue;
                    worksheet.getCell(i + currentRow + 2, projectPeriodCount * columnCount + 4 + j).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                }
            }
        }
        for (let i = 0; i < projectPeriodCount + 1; i++) {
            for (let j = 0; j < columnCount; j++) {
                if (j !== 4) {
                    resultValue = 0;
                    for (let k = 0; k < staffCount; k++) {
                        resultValue = resultValue + worksheet.getCell(currentRow + 2 + k, i * columnCount + 4 + j).value;
                    }
                    worksheet.getCell(currentRow + 2 + staffCount, i * columnCount + 4 + j).value = resultValue;
                    worksheet.getCell(currentRow + 2 + staffCount, i * columnCount + 4 + j).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                    if (j === columnCount - 1) {
                        costPeriodGrandTotals[i] = costPeriodGrandTotals[i] + resultValue;
                    }
                }
            }
        }
        let mergeColumn = 4;
        for (let i = 1; i < projectPeriodCount + 2; i++) {
            worksheet.mergeCells(currentRow, mergeColumn, currentRow, mergeColumn + columnCount - 1);
            worksheet.getCell(currentRow, mergeColumn).alignment = { horizontal: 'center' };
            worksheet.getCell(currentRow, mergeColumn).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
            mergeColumn = mergeColumn + columnCount;
        }
        for (let i = 2; i < 4; i++) {
            worksheet.getCell(currentRow, i).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
        }
        for (let i = 2; i < (projectPeriodCount + 1) * columnCount + 4; i++) {
            for (let j = currentRow; j < currentRow + 2; j++) {
                worksheet.getCell(j, i).font = { bold: true };
            }
            for (let j = currentRow + 1; j < staffCount + currentRow + 3; j++) {
                worksheet.getCell(j, i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' } };
            }
        }
        worksheet.getCell(currentRow + 2 + staffCount, 2).value = 'Total';
        worksheet.getCell(currentRow + 2 + staffCount, 2).font = { bold: true };
        currentRow = currentRow + staff.length + 4;
    }
    if (0 < casualStaff.length) {
        worksheet.addRow([]);
        const casualStaffCount = casualStaff.length;
        let salaryHeader = ['', 'Casual Staff', ''];
        salaryHeader = salaryHeader.concat(periodHeader);
        salaryHeader.push('Project Summary');
        const salaryHeader2 = ['', '', 'Level'];
        for (let i = 0; i < projectPeriodCount; i++) {
            salaryHeader2.push('Hourly Rate', 'Hours', 'ACC', 'KiwiSaver', 'Holiday Pay', 'Total');
        }
        salaryHeader2.push('Hourly Rate', 'Hours', 'ACC', 'KiwiSaver', 'Holiday Pay', 'Total');
        worksheet.addRow(salaryHeader);
        worksheet.addRow(salaryHeader2);
        let hourlyRate: number;
        let hours: number;
        let kiwiSaver;
        let acc;
        let holidayPay;
        let resultValue;
        for (let i = 0; i < casualStaffCount; i++) {
            worksheet.getCell(i + currentRow + 2, 2).value = casualStaff[i].nameDisplay;
            worksheet.getCell(i + currentRow + 2, 3).value = casualStaff[i].titleDisplay;
            for (let j = 0; j < projectPeriodCount; j++) {
                if (casualStaff[i].casualCommitments != null && j < casualStaff[i].casualCommitments.length
                    && casualStaff[i].casualCommitments[j].hourlyRate != null) {
                    hourlyRate = + casualStaff[i].casualCommitments[j].hourlyRate;
                } else {
                    hourlyRate = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 4).value = hourlyRate;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 4).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (casualStaff[i].casualCommitments != null && j < casualStaff[i].casualCommitments.length
                    && casualStaff[i].casualCommitments[j].hours != null) {
                    hours = + casualStaff[i].casualCommitments[j].hours;
                } else {
                    hours = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 5).value = hours;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 5).numFmt = '_-* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (casualStaff[i].accMap != null && j < casualStaff[i].accMap.length) {
                    acc = + casualStaff[i].accMap[j].value;
                } else {
                    acc = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 6).value = acc;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 6).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (casualStaff[i].kiwiSaverMap != null && j < casualStaff[i].kiwiSaverMap.length) {
                    kiwiSaver = + casualStaff[i].kiwiSaverMap[j].value;
                } else {
                    kiwiSaver = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 7).value = kiwiSaver;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 7).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (casualStaff[i].holidayPayMap != null && j < casualStaff[i].holidayPayMap.length) {
                    holidayPay = +casualStaff[i].holidayPayMap[j].value;
                } else {
                    holidayPay = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 8).value = holidayPay;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 8).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                worksheet.getCell(i + currentRow + 2, j * columnCount + 9).value = hourlyRate * hours + acc + kiwiSaver + holidayPay;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
            }
            for (let j = 0; j < columnCount; j++) {
                resultValue = 0;
                for (let k = 0; k < projectPeriodCount; k++) {
                    resultValue = resultValue + worksheet.getCell(currentRow + 2 + i, k * columnCount + 4 + j).value;
                }
                worksheet.getCell(currentRow + 2 + i, projectPeriodCount * columnCount + 4 + j).value = resultValue;
                if (j !== 1) {
                    worksheet.getCell(currentRow + 2 + i, projectPeriodCount * columnCount + 4 + j).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                } else {
                    worksheet.getCell(currentRow + 2 + i, projectPeriodCount * columnCount + 4 + j).numFmt = '_-* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                }
            }
        }
        for (let i = 0; i < projectPeriodCount + 1; i++) {
            for (let j = 0; j < columnCount; j++) {
                if (j !== 1) {
                    resultValue = 0;
                    for (let k = 0; k < casualStaffCount; k++) {
                        resultValue = resultValue + worksheet.getCell(currentRow + 2 + k, i * columnCount + 4 + j).value;
                    }
                    worksheet.getCell(currentRow + 2 + casualStaffCount, i * columnCount + 4 + j).value = resultValue;
                    worksheet.getCell(currentRow + 2 + casualStaffCount, i * columnCount + 4 + j).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                    if (j === columnCount - 1) {
                        costPeriodGrandTotals[i] = costPeriodGrandTotals[i] + resultValue;
                    }
                }
            }
        }
        let mergeColumn = 4;
        for (let i = 1; i < projectPeriodCount + 2; i++) {
            worksheet.mergeCells(currentRow, mergeColumn, currentRow, mergeColumn + columnCount - 1);
            worksheet.getCell(currentRow, mergeColumn).alignment = { horizontal: 'center' };
            worksheet.getCell(currentRow, mergeColumn).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
            mergeColumn = mergeColumn + columnCount;
        }
        for (let i = 2; i < 4; i++) {
            worksheet.getCell(currentRow, i).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
        }
        for (let i = 2; i < (projectPeriodCount + 1) * columnCount + 4; i++) {
            for (let j = currentRow; j < currentRow + 2; j++) {
                worksheet.getCell(j, i).font = { bold: true };
            }
            for (let j = currentRow + 1; j < casualStaffCount + currentRow + 3; j++) {
                worksheet.getCell(j, i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' } };
            }
        }
        worksheet.getCell(currentRow + 2 + casualStaffCount, 2).value = 'Total';
        worksheet.getCell(currentRow + 2 + casualStaffCount, 2).font = { bold: true };
        currentRow = currentRow + casualStaff.length + 4;
    }
    if (0 < students.length) {
        worksheet.addRow([]);
        const studentCount = students.length;
        let salaryHeader = ['', 'Student', ''];
        salaryHeader = salaryHeader.concat(periodHeader);
        salaryHeader.push('Project Summary');
        const salaryHeader2 = ['', '', 'Level'];
        for (let i = 0; i < projectPeriodCount; i++) {
            salaryHeader2.push('Stipend', 'Tuition', 'Insurance', 'Student Service', '', 'Total');
        }
        salaryHeader2.push('Stipend', 'Tuition', 'Insurance', 'Student Service', '', 'Total');
        worksheet.addRow(salaryHeader);
        worksheet.addRow(salaryHeader2);
        let stipend;
        let tuition;
        let insurance;
        let studentService;
        let resultValue;
        for (let i = 0; i < studentCount; i++) {
            worksheet.getCell(i + currentRow + 2, 2).value = students[i].nameDisplay;
            worksheet.getCell(i + currentRow + 2, 3).value = students[i].titleDisplay;
            for (let j = 0; j < projectPeriodCount; j++) {
                if (students[i].stipendMap != null && j < students[i].stipendMap.length) {
                    stipend = +students[i].stipendMap[j].value;
                } else {
                    stipend = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 4).value = stipend;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 4).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (students[i].tuitionMap != null && j < students[i].tuitionMap.length) {
                    tuition = +students[i].tuitionMap[j].value;
                } else {
                    tuition = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 5).value = tuition;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 5).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (students[i].insuranceMap != null && j < students[i].insuranceMap.length) {
                    insurance = +students[i].insuranceMap[j].value;
                } else {
                    insurance = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 6).value = insurance;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 6).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                if (students[i].studentServiceMap != null && j < students[i].studentServiceMap.length) {
                    studentService = +students[i].studentServiceMap[j].value;
                } else {
                    studentService = 0
                }
                worksheet.getCell(i + currentRow + 2, j * columnCount + 7).value = studentService;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 7).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                worksheet.getCell(i + currentRow + 2, j * columnCount + 9).value = stipend + tuition + insurance + studentService;
                worksheet.getCell(i + currentRow + 2, j * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
            }
            for (let j = 0; j < columnCount; j++) {
                if (j !== 4) {
                    resultValue = 0;
                    for (let k = 0; k < projectPeriodCount; k++) {
                        resultValue = resultValue + worksheet.getCell(currentRow + 2 + i, k * columnCount + 4 + j).value
                    }
                    worksheet.getCell(currentRow + 2 + i, projectPeriodCount * columnCount + 4 + j).value = resultValue;
                    worksheet.getCell(currentRow + 2 + i, projectPeriodCount * columnCount + 4 + j).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                }
            }
        }
        for (let i = 0; i < projectPeriodCount + 1; i++) {
            for (let j = 0; j < columnCount; j++) {
                if (j !== 4) {
                    resultValue = 0;
                    for (let k = 0; k < studentCount; k++) {
                        resultValue = resultValue + worksheet.getCell(currentRow + 2 + k, i * columnCount + 4 + j).value;
                    }
                    worksheet.getCell(currentRow + 2 + studentCount, i * columnCount + 4 + j).value = resultValue;
                    worksheet.getCell(currentRow + 2 + studentCount, i * columnCount + 4 + j).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                    if (j === columnCount - 1) {
                        costPeriodGrandTotals[i] = costPeriodGrandTotals[i] + resultValue;
                    }
                }
            }
        }
        let mergeColumn = 4;
        for (let i = 1; i < projectPeriodCount + 2; i++) {
            worksheet.mergeCells(currentRow, mergeColumn, currentRow, mergeColumn + columnCount - 1);
            worksheet.getCell(currentRow, mergeColumn).alignment = { horizontal: 'center' };
            worksheet.getCell(currentRow, mergeColumn).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
            mergeColumn = mergeColumn + columnCount;
        }
        for (let i = 2; i < 4; i++) {
            worksheet.getCell(currentRow, i).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
        }
        for (let i = 2; i < (projectPeriodCount + 1) * columnCount + 4; i++) {
            for (let j = currentRow; j < currentRow + 2; j++) {
                worksheet.getCell(j, i).font = { bold: true };
            }
            for (let j = currentRow + 1; j < studentCount + currentRow + 3; j++) {
                worksheet.getCell(j, i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' } };
            }
        }
        worksheet.getCell(currentRow + 2 + studentCount, 2).value = 'Total';
        worksheet.getCell(currentRow + 2 + studentCount, 2).font = { bold: true };
        currentRow = currentRow + students.length + 4;
    }

    let amount;
    let directCostTotal;
    let costPeriodTotals;
    let allDirectCostTotal;

    // Expenses table in Funder
    if (0 < directCosts.length) {
        worksheet.getCell(currentRow, 2).value = 'Expenses';
        worksheet.getCell(currentRow, 2).font = { bold: true };
        costPeriodTotals = [];
        allDirectCostTotal = 0;
        for (let i = 0; i < projectPeriodCount; i++) {
            costPeriodTotals.push(0)
        }
        for (let i = 0; i < directCosts.length; i++) {
            worksheet.getCell(currentRow + i + 1, 2).value = directCosts[i].nonPeopleDescription;
            directCostTotal = 0;
            for (let j = 0; j < projectPeriodCount; j++) {
                amount = 0;
                if (j < directCosts[i].costPeriods.length && directCosts[i].costPeriods[j].value) {
                    amount = parseInt(directCosts[i].costPeriods[j].value, 10)
                }
                worksheet.getCell(currentRow + i + 1, j * columnCount + 9).value = amount;
                worksheet.getCell(currentRow + i + 1, j * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                directCostTotal = directCostTotal + amount;
                costPeriodTotals[j] = costPeriodTotals[j] + amount;
                allDirectCostTotal = allDirectCostTotal + amount;
            }
            worksheet.getCell(currentRow + i + 1, projectPeriodCount * columnCount + 9).value = directCostTotal;
            worksheet.getCell(currentRow + i + 1, projectPeriodCount * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        }
        for (let i = 0; i < projectPeriodCount; i++) {
            worksheet.getCell(currentRow + directCosts.length + 1, i * columnCount + 9).value = costPeriodTotals[i];
            worksheet.getCell(currentRow + directCosts.length + 1, i * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        }
        worksheet.getCell(currentRow + directCosts.length + 1, 2).value = 'Total';
        worksheet.getCell(currentRow + directCosts.length + 1, 2).font = { bold: true };
        worksheet.getCell(currentRow + directCosts.length + 1, projectPeriodCount * columnCount + 9).value = allDirectCostTotal;
        worksheet.getCell(currentRow + directCosts.length + 1, projectPeriodCount * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        for (let i = 0; i < directCosts.length + 2; i++) {
            worksheet.getCell(currentRow + i, 2).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' }};
            worksheet.getCell(currentRow + i, 3).border = {
                top: { style: 'thin' },
                right: { style: 'thin' },
                bottom: { style: 'thin' }};
            for (let j = 0; j < projectPeriodCount + 1; j++) {
                worksheet.getCell(currentRow + i, j * columnCount + 4).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' }};
                for (let k = 0; k < columnCount - 2; k++) {
                    worksheet.getCell(currentRow + i, j * columnCount + 5 + k).border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' }};
                }
                worksheet.getCell(currentRow + i, j * columnCount + 9).border = {
                    top: { style: 'thin' },
                    right: { style: 'thin' },
                    bottom: { style: 'thin' }};
            }
        }
        for (let i = 0; i < costPeriodTotals.length; i++) {
            costPeriodGrandTotals[i] = costPeriodGrandTotals[i] + costPeriodTotals[i];
        }
        costPeriodGrandTotals[costPeriodGrandTotals.length - 1] =
            costPeriodGrandTotals[costPeriodGrandTotals.length - 1] + allDirectCostTotal;
        currentRow = currentRow + directCosts.length + 3;
    }

    // Subcontracts table in Funder
    if (0 < subcontracts.length) {
        worksheet.getCell(currentRow, 2).value = 'Subcontracts';
        worksheet.getCell(currentRow, 2).font = { bold: true };
        worksheet.getCell(currentRow + 1, 2).value = 'Description';
        worksheet.getCell(currentRow + 1, 2).font = { bold: true };
        worksheet.getCell(currentRow + 1, 3).value = 'Institution';
        worksheet.getCell(currentRow + 1, 3).font = { bold: true };
        costPeriodTotals = [];
        allDirectCostTotal = 0;
        for (let i = 0; i < projectPeriodCount; i++) {
            costPeriodTotals.push(0)
        }
        for (let i = 0; i < subcontracts.length; i++) {
            worksheet.getCell(currentRow + i + 2, 2).value = subcontracts[i].nonPeopleDescription;
            worksheet.getCell(currentRow + i + 2, 3).value = subcontracts[i].institution;
            directCostTotal = 0;
            for (let j = 0; j < projectPeriodCount; j++) {
                amount = 0;
                if (j < subcontracts[i].costPeriods.length && subcontracts[i].costPeriods[j].value) {
                    amount = parseInt(subcontracts[i].costPeriods[j].value, 10)
                }
                worksheet.getCell(currentRow + i + 2, j * columnCount + 9).value = amount;
                worksheet.getCell(currentRow + i + 2, j * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                directCostTotal = directCostTotal + amount;
                costPeriodTotals[j] = costPeriodTotals[j] + amount;
                allDirectCostTotal = allDirectCostTotal + amount;
            }
            worksheet.getCell(currentRow + i + 2, projectPeriodCount * columnCount + 9).value = directCostTotal;
            worksheet.getCell(currentRow + i + 2, projectPeriodCount * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        }
        for (let i = 0; i < projectPeriodCount; i++) {
            worksheet.getCell(currentRow + subcontracts.length + 2, i * columnCount + 9).value = costPeriodTotals[i];
            worksheet.getCell(currentRow + subcontracts.length + 2, i * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        }
        worksheet.getCell(currentRow + subcontracts.length + 2, 2).value = 'Total';
        worksheet.getCell(currentRow + subcontracts.length + 2, 2).font = { bold: true };
        worksheet.getCell(currentRow + subcontracts.length + 2, projectPeriodCount * columnCount + 9).value = allDirectCostTotal;
        worksheet.getCell(currentRow + subcontracts.length + 2, projectPeriodCount * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        for (let i = 0; i < subcontracts.length + 3; i++) {
            if (i === 0) {
                worksheet.getCell(currentRow + i, 2).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' }};
            } else {
                worksheet.getCell(currentRow + i, 2).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                    bottom: { style: 'thin' }};
            }
            worksheet.getCell(currentRow + i, 3).border = {
                top: { style: 'thin' },
                right: { style: 'thin' },
                bottom: { style: 'thin' }};
            for (let j = 0; j < projectPeriodCount + 1; j++) {
                worksheet.getCell(currentRow + i, j * columnCount + 4).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' }};
                for (let k = 0; k < columnCount - 2; k++) {
                    worksheet.getCell(currentRow + i, j * columnCount + 5 + k).border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' }};
                }
                worksheet.getCell(currentRow + i, j * columnCount + 9).border = {
                    top: { style: 'thin' },
                    right: { style: 'thin' },
                    bottom: { style: 'thin' }};
            }
        }
        for (let i = 0; i < costPeriodTotals.length; i++) {
            costPeriodGrandTotals[i] = costPeriodGrandTotals[i] + costPeriodTotals[i];
        }
        costPeriodGrandTotals[costPeriodGrandTotals.length - 1] =
            costPeriodGrandTotals[costPeriodGrandTotals.length - 1] + allDirectCostTotal;
        currentRow = currentRow + subcontracts.length + 4;
    }

    // Contracts for Service table in Funder
    if (0 < contractsForService.length) {
        worksheet.getCell(currentRow, 2).value = 'Contracts for Service';
        worksheet.getCell(currentRow, 2).font = { bold: true };
        worksheet.getCell(currentRow + 1, 2).value = 'Description';
        worksheet.getCell(currentRow + 1, 2).font = { bold: true };
        worksheet.getCell(currentRow + 1, 3).value = 'Institution';
        worksheet.getCell(currentRow + 1, 3).font = { bold: true };
        costPeriodTotals = [];
        allDirectCostTotal = 0;
        for (let i = 0; i < projectPeriodCount; i++) {
            costPeriodTotals.push(0)
        }
        for (let i = 0; i < contractsForService.length; i++) {
            worksheet.getCell(currentRow + i + 2, 2).value = contractsForService[i].nonPeopleDescription;
            worksheet.getCell(currentRow + i + 2, 3).value = contractsForService[i].institution;
            directCostTotal = 0;
            for (let j = 0; j < projectPeriodCount; j++) {
                amount = 0;
                if (j < contractsForService[i].costPeriods.length && contractsForService[i].costPeriods[j].value) {
                    amount = parseInt(contractsForService[i].costPeriods[j].value, 10)
                }
                worksheet.getCell(currentRow + i + 2, j * columnCount + 9).value = amount;
                worksheet.getCell(currentRow + i + 2, j * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
                directCostTotal = directCostTotal + amount;
                costPeriodTotals[j] = costPeriodTotals[j] + amount;
                allDirectCostTotal = allDirectCostTotal + amount;
            }
            worksheet.getCell(currentRow + i + 2, projectPeriodCount * columnCount + 9).value = directCostTotal;
            worksheet.getCell(currentRow + i + 2, projectPeriodCount * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        }
        for (let i = 0; i < projectPeriodCount; i++) {
            worksheet.getCell(currentRow + contractsForService.length + 2, i * columnCount + 9).value = costPeriodTotals[i];
            worksheet.getCell(currentRow + contractsForService.length + 2, i * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        }
        worksheet.getCell(currentRow + contractsForService.length + 2, 2).value = 'Total';
        worksheet.getCell(currentRow + contractsForService.length + 2, 2).font = { bold: true };
        worksheet.getCell(currentRow + contractsForService.length + 2, projectPeriodCount * columnCount + 9).value = allDirectCostTotal;
        worksheet.getCell(currentRow + contractsForService.length + 2, projectPeriodCount * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
        for (let i = 0; i < contractsForService.length + 3; i++) {
            if (i === 0) {
                worksheet.getCell(currentRow + i, 2).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' }};
            } else {
                worksheet.getCell(currentRow + i, 2).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                    bottom: { style: 'thin' }};
            }
            worksheet.getCell(currentRow + i, 3).border = {
                top: { style: 'thin' },
                right: { style: 'thin' },
                bottom: { style: 'thin' }};
            for (let j = 0; j < projectPeriodCount + 1; j++) {
                worksheet.getCell(currentRow + i, j * columnCount + 4).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' }};
                for (let k = 0; k < columnCount - 2; k++) {
                    worksheet.getCell(currentRow + i, j * columnCount + 5 + k).border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' }};
                }
                worksheet.getCell(currentRow + i, j * columnCount + 9).border = {
                    top: { style: 'thin' },
                    right: { style: 'thin' },
                    bottom: { style: 'thin' }};
            }
        }
        for (let i = 0; i < costPeriodTotals.length; i++) {
            costPeriodGrandTotals[i] = costPeriodGrandTotals[i] + costPeriodTotals[i];
        }
        costPeriodGrandTotals[costPeriodGrandTotals.length - 1] =
            costPeriodGrandTotals[costPeriodGrandTotals.length - 1] + allDirectCostTotal;
        currentRow = currentRow + contractsForService.length + 4;
    }

    // Total
    worksheet.getCell(currentRow, 2).value = 'Total';
    worksheet.getCell(currentRow, 2).font = { bold: true };
    for (let i = 0; i < projectPeriodCount + 1; i++) {
        worksheet.getCell(currentRow, i * columnCount + 9).value = costPeriodGrandTotals[i];
        worksheet.getCell(currentRow, i * columnCount + 9).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
        worksheet.getCell(currentRow, i * columnCount + 9).font = { bold: true };
    }
    worksheet.getCell(currentRow, 2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' }};
    worksheet.getCell(currentRow, 3).border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }};
    for (let j = 0; j < projectPeriodCount + 1; j++) {
        worksheet.getCell(currentRow, j * columnCount + 4).border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'}
        };
        for (let k = 0; k < columnCount - 2; k++) {
            worksheet.getCell(currentRow, j * columnCount + 5 + k).border = {
                top: {style: 'thin'},
                bottom: {style: 'thin'}
            };
        }
        worksheet.getCell(currentRow, j * columnCount + 9).border = {
            top: {style: 'thin'},
            right: {style: 'thin'},
            bottom: {style: 'thin'}
        };
    }
    currentRow = currentRow + 2;

    worksheet.getCell(currentRow, 2).value = 'FTE';
    worksheet.getCell(currentRow, 2).font = { bold: true };
    worksheet.getCell(currentRow, 2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' }};
    worksheet.getCell(currentRow, 3).border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }};
    currentRow = currentRow + 1;
    worksheet.getCell(currentRow, 2).border = {
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }};
    worksheet.getCell(currentRow, 3).value = 'Level';
    worksheet.getCell(currentRow, 3).font = { bold: true };
    worksheet.getCell(currentRow, 3).border = {
        bottom: { style: 'thin' },
        right: { style: 'thin' }};
    for (let i = 0; i < projectPeriodCount; i++) {
        for (let j = 0; j < columnCount; j++) {
            for (let k = 0; k < 3; k++) {
                if (j !== columnCount - 1 || k === 0) {
                    worksheet.getCell(currentRow + k - 2, i * columnCount + 4 + j).border = { bottom: { style: 'thin' } };
                } else {
                    worksheet.getCell(currentRow + k - 2, i * columnCount + 4 + j).border = { bottom: { style: 'thin' },
                        right: { style: 'thin' } };
                }
            }
        }
    }
    currentRow = currentRow + 1;
    const allNonCasualStaff = staff.concat(students);
    for (let i = 0; i < allNonCasualStaff.length; i++) {
        worksheet.getCell(currentRow + i, 2).value = allNonCasualStaff[i].nameDisplay;
        worksheet.getCell(currentRow + i, 2).border = {
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }};
        worksheet.getCell(currentRow + i, 3).value = allNonCasualStaff[i].titleDisplay;
        worksheet.getCell(currentRow + i, 3).border = {
            bottom: { style: 'thin' },
            right: { style: 'thin' }};
        for (let j = 0; j < projectPeriodCount; j++) {
            for (let k = 0; k < columnCount; k++) {
                if (k !== columnCount - 1) {
                    worksheet.getCell(currentRow + i, j * columnCount + 4 + k).border = { bottom: { style: 'thin' }};
                } else {
                    worksheet.getCell(currentRow + i, j * columnCount + 4 + k).value =
                        parseFloat((+allNonCasualStaff[i].fteMap[j].value).toFixed(2));
                    worksheet.getCell(currentRow + i, j * columnCount + 4 + k).numFmt = '0.00';
                    worksheet.getCell(currentRow + i, j * columnCount + 4 + k).border = { bottom: { style: 'thin' },
                        right: { style: 'thin' } };
                }
            }
        }
    }

    currentRow = currentRow + allNonCasualStaff.length;
    /*
    for (let x = 0; x < casualStaff.length; x++) {
        worksheet.getCell(currentRow + x, 2).value = casualStaff[x].nameDisplay;
        worksheet.getCell(currentRow + x, 2).border = {
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        worksheet.getCell(currentRow + x, 3).value = 'CASUAL';
        worksheet.getCell(currentRow + x, 3).border = {
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        for (let y = 0; y < projectPeriodCount; y++) {
            for (let z = 0; z < columnCount; z++) {
                if (z !== columnCount - 1) {
                    worksheet.getCell(currentRow + x, y * columnCount + 4 + z).border = { bottom: { style: 'thin' }};
                } else {
                    worksheet.getCell(currentRow + x, y * columnCount + 4 + z).value =
                        parseFloat((+casualStaff[x].casualCommitments[y].hours).toFixed(2));
                    worksheet.getCell(currentRow + x, y * columnCount + 4 + z).numFmt = '0.00';
                    worksheet.getCell(currentRow + x, y * columnCount + 4 + z).border = { bottom: { style: 'thin' },
                        right: { style: 'thin' } };
                }
            }
        }
    }

     */

    worksheet.columns.forEach((column) => {
        column.width = 16 + 0.62;
    });
    worksheet.columns[0].width = 8.14 + 0.62;
    worksheet.columns[1].width = 28.36 + 0.62;
    worksheet.columns[2].width = 28.36 + 0.62;

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        fs.saveAs(blob, 'Summary.xlsx');
    });
}

export function downloadRocExcel(project, budget, staffs, students, directCosts, subcontracts, contractsForService) {
    const workbook = new exceljs.Workbook();
    workbook.creator = 'Budget Tool';
    workbook.lastModifiedBy = 'Budget Tool';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet2 = workbook.addWorksheet('Sheet1');

    const rocHeader = ['Project ID', 'Account', 'UPI', 'EmpRecord', 'Buyout Dept',
        'Incentive Type', 'FTE', 'Standard Hours', 'Base Amount (NZD)', 'Start Date', 'End Date'];
    worksheet2.addRow(rocHeader);

    //worksheet2.getRow(1).height = 25.50;
    worksheet2.getCell(1, 1).alignment = { vertical: 'bottom' };
    worksheet2.getCell(1, 1).font = { bold: true };
    worksheet2.getCell(1, 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' } };
    for (let i = 2; i < 12; i++) {
        worksheet2.getCell(1, i).alignment = { vertical: 'middle', horizontal: 'center'};
        worksheet2.getCell(1, i).font = { size: 10, bold: true };
        worksheet2.getCell(1, i).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' } };
    }

    let projectCode;
    if (project.projectCode) {
        projectCode = parseInt(project.projectCode, 10);
    } else {
        projectCode = '';
    }

    let startDate;
    let endDate;

    let dateOffset: number;
    if (budget.budgetActivationStartDate) {
        dateOffset = getDateDiff(budget.budgetStartDate, budget.budgetActivationStartDate);
    } else {
        dateOffset = 0
    }

    const budgetPeriodsForActivation = [];

    for (const period of budget.budgetPeriods) {
        startDate = addDays(period.startDate, dateOffset);
        endDate = addDays(period.endDate, dateOffset);
        budgetPeriodsForActivation.push({startDate, endDate})
    }

    const nonCasualStaffs = [];
    const casualStaffs = [];

    for (const staff of staffs) {
        if (staff.peopleType === 'Casual') {
            casualStaffs.push(staff)
        } else {
            nonCasualStaffs.push(staff)
        }
    }

    const revenueRowBaseAmounts = [];
    for (const budgetPeriod of budget.budgetPeriods) {
        revenueRowBaseAmounts.push(0)
    }

    let rocRows = [];
    let salaryRow;
    let accRow;
    let superannuationRow;
    let overheadRow;
    let committedSalary;
    let peopleCost;
    let account;
    let upi;
    let fte;
    let hours;
    let baseAmount;
    let currentRow = 2;
    for (const staff of nonCasualStaffs) {
        let incentiveType;
        let buyoutDept;
        let emplRcdNbr;
        // Staff info
        if (staff.staffUpi) {
            upi = staff.staffUpi;
        } else {
            upi = '';
        }
        incentiveType = staff.incentiveCode ?. incentiveCode;
        if (staff.incentiveCode ?. departmentCode) {
            buyoutDept = parseInt(staff.incentiveCode.departmentCode, 10);
        }
        if (staff.incentiveCode ?. employeeRecord) {
            emplRcdNbr = parseInt(staff.incentiveCode.employeeRecord, 10);
        }
        for (let i = 0; i < staff.committedSalaryMap.length; i++) {
            staff.committedSalaryMap[i].value = combinePeriods(staff.committedSalaryMap[i].value);
            for (let j = 0; j < staff.committedSalaryMap[i].value.length; j++) {
                committedSalary = staff.committedSalaryMap[i].value[j];
                // Staff people period info
                startDate = addDays(committedSalary.startDate, dateOffset);
                endDate = addDays(committedSalary.endDate, dateOffset);
                fte = roundToTwoDP(+committedSalary.commitment);
                hours = null;
                // ROC Salary
                salaryRow = [];
                peopleCost = null;
                account = '';
                if (staff.staffType === 'Academic' || staff.staffType === 'AcademicPlus') {
                    if (staff.registerType === 'Fixed Term') {
                        peopleCost = 'Salaries Academic - Fixed Term';
                    } else {
                        peopleCost = 'Salaries Academic - Long Term';
                    }
                } else if (staff.staffType === 'Professional') {
                    if (staff.registerType === 'Fixed Term') {
                        peopleCost = 'Professional Salaries - Fixed';
                    } else {
                        peopleCost = 'Professional Salaries - Long T';
                    }
                } else if (staff.staffType === 'Post-Doctoral Fellow') { /// CHECK TYPE FOR POSTDOC
                    peopleCost = 'Salaries - postdoctoral';
                }
                if (peopleCost !== null) {
                    account = parseInt(CostUtil.getPeopleCostCategory(peopleCost), 10)
                }
                baseAmount = roundToTwoDP(committedSalary.salary) +
                    roundToTwoDP(committedSalary.allowance);
                if (0 < baseAmount) {
                    salaryRow = [projectCode, account > 0 ? account : 0, upi, emplRcdNbr, buyoutDept,
                        incentiveType, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                    rocRows = rocRows.concat([salaryRow]);
                    revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
                }
                // ROC ACC
                accRow = [];
                account = 700;
                baseAmount = (committedSalary.salary + committedSalary.allowance) *
                    project.funderRule.accPct / 100;
                if (0 < baseAmount) {
                    accRow = [projectCode, account > 0 ? account : 0, upi, emplRcdNbr, buyoutDept,
                        incentiveType, fte, hours, roundToTwoDP(baseAmount),
                        budgetPeriodsForActivation[i].startDate, budgetPeriodsForActivation[i].endDate, i];
                    rocRows = rocRows.concat([accRow]);
                    revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
                }
                // ROC Superannuation
                superannuationRow = [];
                account = 741;
                baseAmount = (committedSalary.salary + committedSalary.allowance) *
                    project.funderRule.superannuationPct / 100;
                if (0 < baseAmount) {
                    superannuationRow = [projectCode, account > 0 ? account : 0, upi, emplRcdNbr, buyoutDept,
                        incentiveType, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                    rocRows = rocRows.concat([superannuationRow]);
                    revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
                }
                // ROC Overhead
                overheadRow = [];
                account = 885;
                baseAmount = (committedSalary.salary + committedSalary.allowance)
                    * project.funderRule.overheadPct / 100;
                if (0 < baseAmount) {
                    overheadRow = [projectCode, account > 0 ? account : 0, upi, emplRcdNbr, buyoutDept,
                        incentiveType, fte, hours, roundToTwoDP(baseAmount),
                        budgetPeriodsForActivation[i].startDate, budgetPeriodsForActivation[i].endDate, i];
                    rocRows = rocRows.concat([overheadRow]);
                    revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
                }
            }
        }
    }
    let casualCommitment;
    let holidayPayRow;
    for (const casualStaff of casualStaffs) {
        for (let i = 0; i < casualStaff.casualCommitments.length; i++) {
            casualCommitment = casualStaff.casualCommitments[i];
            startDate = budgetPeriodsForActivation[i].startDate;
            endDate = budgetPeriodsForActivation[i].endDate;
            fte = null;
            hours = casualCommitment.hours;
            // ROC Casual Salary
            salaryRow = [];
            peopleCost = 'Professional Staff - Casual';
            account = parseInt(CostUtil.getPeopleCostCategory(peopleCost), 10);
            baseAmount = casualStaff.casualSalaryMap[i].value;
            if (0 < baseAmount) {
                salaryRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([salaryRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
            // ROC Casual ACC
            accRow = [];
            baseAmount = casualStaff.accMap[i].value;
            if (0 < baseAmount) {
                accRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([accRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
            // ROC Casual Superannuation
            superannuationRow = [];
            baseAmount = casualStaff.kiwiSaverMap[i].value;
            if (0 < baseAmount) {
                superannuationRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([superannuationRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
            // ROC Casual HolidayPay
            holidayPayRow = [];
            baseAmount = casualStaff.holidayPayMap[i].value;
            if (0 < baseAmount) {
                holidayPayRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([holidayPayRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
        }
    }
    let studentCommittedSalary;
    let stipendRow;
    let tuitionRow;
    let insuranceRow;
    let studentServiceRow;
    for (const student of students) {
        for (let i = 0; i < budgetPeriodsForActivation.length; i++) {
            startDate = budgetPeriodsForActivation[i].startDate;
            endDate = budgetPeriodsForActivation[i].endDate;
            fte = roundToTwoDP(student.fteMap[i].value);
            hours = null;
            // ROC Student Stipend
            stipendRow = [];
            account = 848;
            baseAmount = student.stipendMap[i].value;
            if (0 < baseAmount) {
                stipendRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([stipendRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
            // ROC Student Tuition
            tuitionRow = [];
            account = 848010;
            baseAmount = student.tuitionMap[i].value;
            if (0 < baseAmount) {
                tuitionRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([tuitionRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
            // ROC Student Insurance
            insuranceRow = [];
            account = 848010;
            baseAmount = student.insuranceMap[i].value;
            if (0 < baseAmount) {
                insuranceRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([insuranceRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
            // ROC Student StudentService
            studentServiceRow = [];
            account = 848010;
            baseAmount = student.studentServiceMap[i].value;
            if (0 < baseAmount) {
                studentServiceRow = [projectCode, account > 0 ? account : 0, null, null, null,
                    null, fte, hours, roundToTwoDP(baseAmount), startDate, endDate, i];
                rocRows = rocRows.concat([studentServiceRow]);
                revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
            }
        }
    }
    let directCostRow;
    if (Array.isArray(directCosts) && directCosts.length > 0) {
        for (const directCost of directCosts) {
            account = '';
            if (directCost.directCostCategory) {
                account = parseInt(directCost.directCostCategory, 10)
            }
            for (let i = 0; i < directCost.costPeriods.length; i++) {
                baseAmount = 0;
                if (directCost.costPeriods[i].value != null) {
                    startDate = snapStartDate(budgetPeriodsForActivation[i].startDate);
                    endDate = snapEndDate(budgetPeriodsForActivation[i].endDate);
                    baseAmount = directCost.costPeriods[i].value;
                }
                if (0 < baseAmount) {
                    directCostRow = [projectCode, account > 0 ? account : 0, null, null, null,
                        null, null, null, roundToTwoDP(baseAmount), startDate, endDate, i];
                    rocRows = rocRows.concat([directCostRow]);
                    revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
                }
            }
        }
    }
    if (Array.isArray(subcontracts) && subcontracts.length > 0) {
        for (const subcontract of subcontracts) {
            account = parseInt(CostUtil.getCostCategory('Subcontracts - EXT'), 10);
            for (let i = 0; i < budget.budgetPeriod; i++) {
                baseAmount = 0;
                if (subcontract.costPeriods[i].value != null) {
                    startDate = budgetPeriodsForActivation[i].startDate;
                    endDate = budgetPeriodsForActivation[i].endDate;
                    baseAmount = subcontract.costPeriods[i].value;
                }
                if (0 < baseAmount) {
                    directCostRow = [projectCode, account > 0 ? account : 0, null, null, null,
                        null, null, null, roundToTwoDP(baseAmount), startDate, endDate, i];
                    rocRows = rocRows.concat([directCostRow]);
                    revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
                }
            }
        }
    }

    if (Array.isArray(contractsForService) && contractsForService.length > 0) {
        for (const contractForService of contractsForService) {
            account = parseInt(CostUtil.getPeopleCostCategory('Contracts for Service - EXT'), 10);
            for (let i = 0; i < budget.budgetPeriod; i++) {
                baseAmount = 0;
                if (contractForService.costPeriods[i].value != null) {
                    startDate = budgetPeriodsForActivation[i].startDate;
                    endDate = budgetPeriodsForActivation[i].endDate;
                    baseAmount = contractForService.costPeriods[i].value;
                }
                if (0 < baseAmount) {
                    directCostRow = [projectCode, account > 0 ? account : 0, null, null, null,
                        null, null, null, roundToTwoDP(baseAmount), startDate, endDate, i];
                    rocRows = rocRows.concat([directCostRow]);
                    revenueRowBaseAmounts[i] += roundToTwoDP(baseAmount)
                }
            }
        }
    }

    let revenueRow;
    for (let i = 0; i < budget.budgetPeriods.length; i++) {
        if (0 < revenueRowBaseAmounts[i]) {
            startDate = addDays(budget.budgetPeriods[i].startDate, dateOffset);
            endDate = addDays(budget.budgetPeriods[i].endDate, dateOffset);
            account = 619;
            revenueRow = [projectCode, account > 0 ? account : 0, null, null, null,
                null, null, null, 0 - revenueRowBaseAmounts[i], startDate, endDate, i];
            rocRows = rocRows.concat([revenueRow]);
        }
    }

    // Combine rows

    const glCodeWhitelist = [
        720,
        721,
        722,
        723,
        724,
        725,
        726,
        727,
        727010,
        729,
        741,
        772010];

    const allRocRows = cloneDeep(rocRows);
    rocRows = [];
    let index: number;

    for (const row of allRocRows) {
        if (glCodeWhitelist.includes(row[1]) && row[2]) {
            rocRows.push(row)
        } else if (glCodeWhitelist.includes(row[1])) {
            index = -1;
            for (let i = 0; i < rocRows.length; i++) {
                if (row[1] === rocRows[i][1] && row[11] === rocRows[i][11] && !rocRows[i][2]) {
                    index = i
                }
            }
            if (index > -1) {
                rocRows[index][8] += row[8]
            } else {
                row[2] = null;
                row[3] = null;
                row[4] = null;
                row[5] = null;
                row[6] = null;
                row[7] = null;
                row[9] = budgetPeriodsForActivation[row[11]].startDate;
                row[10] = budgetPeriodsForActivation[row[11]].endDate;
                rocRows.push(row)
            }
        } else {
            index = -1;
            for (let i = 0; i < rocRows.length; i++) {
                if (row[1] === rocRows[i][1] && row[11] === rocRows[i][11]) {
                    index = i
                }
            }
            if (index > -1) {
                rocRows[index][8] += row[8]
            } else {
                row[2] = null;
                row[3] = null;
                row[4] = null;
                row[5] = null;
                row[6] = null;
                row[7] = null;
                rocRows.push(row)
            }
        }
    }

    // delete helper fields
    for (let i = 0; i < rocRows.length; i++) {
        rocRows[i].splice(11, 1)
    }

    // sort by GL code then date
    rocRows.sort((a, b) => {
        if (parseInt(a[1], 10) > parseInt(b[1], 10)) {
            return 1;
        } else if (parseInt(a[1], 10) < parseInt(b[1], 10)) {
            return -1;
        } else {
            if (new Date(a[9]) > new Date(b[9])) {
                return 1;
            } else if (new Date(a[9]) < new Date(b[9])) {
                return -1;
            }
        }
        return 0;
    });


    for (const rocRow of rocRows) {
        worksheet2.addRow(rocRow);
        for (let j = 1; j < rocHeader.length + 1; j++) {
            if (j !== 1) {
                //worksheet2.getCell(currentRow, j).alignment = { wrapText: true };
                worksheet2.getCell(currentRow, j).font = { size: 10 };
            }
            if (j === 7 || j === 9) {
                worksheet2.getCell(currentRow, j).numFmt = '#,##0.00';
            }
            worksheet2.getCell(currentRow, j).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' } };
        }
        //worksheet2.getRow(currentRow).height = 15;
        currentRow++;
    }

    worksheet2.columns.forEach((column, i) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 0;
            if (columnLength > maxLength ) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength + 1 + 0.62
    });

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        fs.saveAs(blob, projectCode ? projectCode : '0' + '.xlsx');
    });
}

function getPriority(namedStaff) {
    if (namedStaff.peopleType === 'Named') {
        return 1
    }
    else if (namedStaff.peopleType === 'Unnamed') {
        return 2
    }
    else if (namedStaff.peopleType === 'Casual') {
        return 3
    }
    else if (namedStaff.peopleType === 'Student') {
        return 4
    }
    else return 5
}

function getRole(projectRoles: ProjectRole[], projectRoleName: string) {
    for (const projectRole of projectRoles) {
        if (projectRole.projectRole === projectRoleName) {
            return projectRole
        }
    }
    return null
}

function convertDate(date: Date) {
    return date.toLocaleDateString('en-NZ')
}

function convertDateString(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-NZ')
}

// dateString format is DD/MM/YYYY
function convertStringToDate(dateString: string) {
    const [day, month, year] = dateString.split('/');
    return new Date(+year, +month - 1, +day)
}

function getDateDiff(dateString1: string, dateString2: string) {
    const date1 = Number(new Date(dateString1));
    const date2 = Number(new Date(dateString2));
    return (date2 - date1) / (1000 * 60 * 60 * 24)
}

function addDays(date: string, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return convertDate(result);
}

function combinePeriods(commitedSalaries: CommittedSalary[]) {
    if (commitedSalaries.length < 2) {
        return commitedSalaries
    }
    for (let i = 1; i < commitedSalaries.length; i++) {
        if (commitedSalaries[i].mileStone !== 'USER_ENTRY') {
            commitedSalaries[i-1].days += commitedSalaries[i].days;
            commitedSalaries[i-1].endDate = commitedSalaries[i].endDate;
            commitedSalaries[i-1].salary += roundToTwoDP(commitedSalaries[i].salary);
            commitedSalaries[i-1].allowance += roundToTwoDP(commitedSalaries[i].allowance);
            commitedSalaries.splice(i, 1);
            i--
        }
    }
    return commitedSalaries
}

function roundToTwoDP(num: number) {
    return Math.round(num * 100) / 100
}

function snapStartDate(dateString: string) {
    const date = convertStringToDate(dateString);
    if (date.getDate() === 1) {
        return dateString
    } else if (date.getMonth() === 11) {
        date.setFullYear(date.getFullYear() + 1);
        date.setMonth(0, 1)
    } else {
        date.setMonth(date.getMonth() + 1, 1)
    }
    return convertDate(date)
}

function snapEndDate(dateString: string) {
    const date = convertStringToDate(dateString);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    if (date.getDate() === lastDayOfMonth) {
        return dateString
    } else if (date.getMonth() === 0) {
        date.setFullYear(date.getFullYear() - 1);
        date.setMonth(11, 31)
    } else {
        date.setDate(0)
    }
    return convertDate(date)
}