import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Category } from '../model/category';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private url: string =  `${environment.HOST}/category`; 
  private categoryChange: Subject<Category[]> = new Subject<Category[]>;
  private messageChange: Subject<string> = new Subject<string>;
  findAll(){
      // return this.http.get(this.url);
      return this.http.get<Category[]>(this.url);
    }
  
    findById(id: number){
      return this.http.get<Category>(`${this.url}/${id}`);
    }
  
    save(category: Category){
      return this.http.post(this.url, category);
    }
  
    update(id: number, category: Category){
      return this.http.put(`${this.url}/${id}`, category);
    }
  
    delete(id: number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    ////////////////////
    setCategoryChange(data: Category[]){
      this.categoryChange .next(data);
    }
  
    getCategoryChange(){
      return this.categoryChange.asObservable();
    }
  
    setMessageChange(data: string){
      this.messageChange.next(data);
    }
  
    getMessageChange(){
      return this.messageChange.asObservable();
    }
}
