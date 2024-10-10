import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  DocumentReference,
  Timestamp,
} from '@angular/fire/firestore';
import { Employee } from 'src/app/model/employee';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Correctly import 'map' operator

@Injectable({
  providedIn: 'root',
})
export class EmployeeDbService {
  constructor(private firestore: Firestore) {}
  private employeesCollection = collection(this.firestore, 'employees'); // reference to the 'employee' collection in firebase

  // get all employees from the collection
  getEmployees(): Observable<Employee[]> {
    return collectionData(this.employeesCollection, {
      idField: 'id',
    }).pipe(
      map((employees: any[]) => {
        // return the employees with firestore Timestamps as js Date objects
        return employees.map((employee) => ({
          ...employee,
          dateOfBirth: (employee.dateOfBirth as Timestamp).toDate(),
        }));
      })
    ) as Observable<Employee[]>;
  }

  // add an employee to the collection
  async createEmployee(employee: Employee): Promise<DocumentReference> {
    try {
      const employeeData = {
        ...employee,
      }; // convert to a basic js object

      // add employee to the 'employee' collection
      const docRef = await addDoc(this.employeesCollection, employeeData);
      console.log('Employee added with ID:', docRef.id);
      return docRef;
    } catch (e) {
      console.log('There was an error adding an employee to the db.', e);
      throw e;
    }
  }
}
