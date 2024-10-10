import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Employee } from '../model/employee';
import { EmployeeDbService } from '../employee/firestore/employee-db.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees$ = new BehaviorSubject<readonly Employee[]>([]); // hold state of Employee[]
  private employeesSubscription: Subscription; // listens and recieves real time updates from firestore

  constructor(private employeeDbService: EmployeeDbService) {
    // subscription to the firestore observable and update the BehaviorSubject
    this.employeesSubscription = this.employeeDbService
      .getEmployees() // getEmployees from EmployeeDbService
      .subscribe({
        next: (employees) => {
          this.employees$.next(employees);
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          this.employees$.next([]); // emit empty array on error
        },
      });
  }

  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  addEmployee(employee: Employee) {
    // no need for this anymore since we subscribed to firestore observable, it will update in real time with the db
    // this.employees$.next([...this.employees$.getValue(), employee]);

    // we will instead add directly to the db using the db service
    this.employeeDbService.createEmployee(employee);
    return true;
  }

  // clean up subscription
  ngOnDestroy(): void {
    if (this.employeesSubscription) {
      this.employeesSubscription.unsubscribe();
    }
  }
}
