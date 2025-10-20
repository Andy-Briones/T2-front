import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Family } from '../model/family';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  constructor(private http: HttpClient) {}

  private url: string =  `${environment.HOST}/family`; 
  private familyChange: Subject<Family[]> = new Subject<Family[]>;
  private messageChange: Subject<string> = new Subject<string>;

  findAll(){
    // return this.http.get(this.url);
    return this.http.get<Family[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Family>(`${this.url}/${id}`);
  }

  save(patient: Family){
    return this.http.post(this.url, patient);
  }

  update(id: number, family: Family){
    return this.http.put(`${this.url}/${id}`, family);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  ////////////////////
  setFamilyChange(data: Family[]){
    this.familyChange.next(data);
  }

  getFamilyChange(){
    return this.familyChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
