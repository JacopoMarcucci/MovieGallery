import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any>(null); // Use BehaviorSubject for shared data
  public currentData$ = this.dataSubject.asObservable();

  updateSharedData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.value; // Or subscribe to currentData$ in components
  }
}