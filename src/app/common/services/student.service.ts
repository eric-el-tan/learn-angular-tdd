
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProjectsService } from './projects.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../entities/user';
import { Project } from '../entities/project';
import { Staff } from '../entities/people/staff';
import { UnnamedStaffData } from '../data/unnamed-staff.data';
import { Student, StudentType } from '../entities/people/student';
import { CostType } from '../entities/cost/cost';
import { CostService } from './cost.service';
import { PeopleType } from '../entities/people/peopleCost';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  public apiServer = environment.apiServer;
  public student$ = new BehaviorSubject<Student>(null);
  public unsavedStudent$ = new BehaviorSubject<Student>(null);

  constructor(private _http: HttpClient, private _costService: CostService) {}

  public students$ = new BehaviorSubject<Student[]>(null);

  async addStudent(student: Student) {
    console.log(`addStudent ${this.apiServer}/projects/${student.projectId}/budgets/${student.budgetId}/costs`, student);
    await this._http.post<Student>(`${this.apiServer}/projects/${student.projectId}/budgets/${student.budgetId}/costs`, student)
    .toPromise()
    .then(
      (result) => {
        console.log('create student: success!', result);
        this._costService.getCosts(student.projectId, student.budgetId);
      },
      (error) => console.error('create student: error!', error)
    );
  }

  async updateStudent(student: Student) {
    console.log(`updateStudent ${this.apiServer}/projects/${student.projectId}/budgets/${student.budgetId}/costs/${student.costId}`);
    await this._http.patch<Student>(`${this.apiServer}/projects/${student.projectId}/budgets/${student.budgetId}/costs/${student.costId}`, student)
    .toPromise()
    .then(
      (result) => {
        console.log('update student: Success!', result);
        this._costService.getCosts(student.projectId, student.budgetId);
      },
      (error) => console.error('update student: Error!', error)
    );
  }

  updateStudentPromise(student: Student): Promise<Student> {
    console.log(`updateStudentPromise ${this.apiServer}/projects/${student.projectId}/budgets/${student.budgetId}/costs/${student.costId}`);
    return this._http.patch<Student>(`${this.apiServer}/projects/${student.projectId}/budgets/${student.budgetId}/costs/${student.costId}`, student)
    .toPromise();
  }

  async deleteStudent(unnamedStaff: Staff) {
    console.log(`deleteStudent /projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`);
    await this._http.delete<Student>(`${this.apiServer}/projects/${unnamedStaff.projectId}/budgets/${unnamedStaff.budgetId}/costs/${unnamedStaff.costId}`)
    .toPromise()
    .then(
      (result) => {
        console.log('delete student: Success!', result);
        this._costService.getCosts(unnamedStaff.projectId, unnamedStaff.budgetId);
      },
      (error) => console.error('delete student: Error!', error)
    );
  }

  private static studentTemplate: Student = {
    costId: null,
    costType: CostType.People,
    peopleId: null,
    nameDisplay: 'Unnamed student 1',
    titleDisplay: '',
    peopleType: PeopleType.Student,
    commitments: [],
    glcode: 'GL01',
    projectId: null,
    budgetId: null,
    modifiedAt: null,
    modifiedBy: null,
    studentType: null,
    stipend: false,
    tuition: false,
    international: false,
    masterFaculty: null,
    masterBand: null,
    studentSalary: {
      stipend: 0.0,
      tuition: 0.0,
      insurance: 0.0,
      studentService: 0.0,
    },
    forecastedStudentSalaries: [],
    committedStudentSalaryMap: [],
    totalSalaryMap: [], 
    fteMap: [], 
    stipendMap: [],
    tuitionMap: [],
    insuranceMap: [],
    studentServiceMap: [],
  };

  public getInstance(project: Project): Staff {
    let data: Staff = cloneDeep(StudentService.studentTemplate);
    data.projectId = project?.projectId;
    data.modifiedAt = Date.now();
    return data;
  }
}
