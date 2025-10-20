import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Laboratory } from '../model/laboratory';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService {
  constructor(private http: HttpClient) {}

  private url: string =  `${environment.HOST}/laboratory`; 
  private laboratoryChange: Subject<Laboratory[]> = new Subject<Laboratory[]>;
  private messageChange: Subject<string> = new Subject<string>;
  findAll(){
      // return this.http.get(this.url);
      return this.http.get<Laboratory[]>(this.url);
    }
  
    findById(id: number){
      return this.http.get<Laboratory>(`${this.url}/${id}`);
    }
  
    save(laboratory: Laboratory){
      return this.http.post(this.url, laboratory);
    }
  
    update(id: number, laboratory: Laboratory){
      return this.http.put(`${this.url}/${id}`, laboratory);
    }
  
    delete(id: number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    ////////////////////
    setLaboratoryChange(data: Laboratory[]){
      this.laboratoryChange .next(data);
    }
  
    getLaboratoryChange(){
      return this.laboratoryChange.asObservable();
    }
  
    setMessageChange(data: string){
      this.messageChange.next(data);
    }
  
    getMessageChange(){
      return this.messageChange.asObservable();
    }
}
