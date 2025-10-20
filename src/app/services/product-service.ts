import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Product } from '../model/product';
import { Observable, Subject } from 'rxjs';
import { Category } from '../model/category';
import { Family } from '../model/family';
import { Laboratory } from '../model/laboratory';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private url: string =  `${environment.HOST}/product`; 
  private productChange: Subject<Product[]> = new Subject<Product[]>;
  private messageChange: Subject<string> = new Subject<string>;

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  add(product: Product): Observable<Product> {
    const dto = this.buildDto(product);
    return this.http.post<Product>(this.url, dto);
  }
  save(product: Product) {
    return this.http.post(this.url, product);
  }

  update(id: number, product: Product): Observable<Product> {
    const dto = this.buildDto(product);
    return this.http.put<Product>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getProductChange(): Observable<Product[]> {
    return this.productChange.asObservable();
  }

  setProductChange(products: Product[]): void {
    this.productChange.next(products);
  }

  getMessageChange(): Observable<string> {
    return this.messageChange.asObservable();
  }

  setMessageChange(message: string): void {
    this.messageChange.next(message);
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}`);
  }

  getFamilies(): Observable<Family[]> {
    return this.http.get<Family[]>(`${this.url}`);
  }

  getLaboratories(): Observable<Laboratory[]> {
    return this.http.get<Laboratory[]>(`${this.url}`);
  }

  private buildDto(product: Product) {
    return {
      name: product.name,
      description: product.description,
      presentation: product.presentation,
      stock: product.stock,
      unuit_price: product.unuit_price,
      expired: product.expired,
      category: typeof product.category === 'object' ? product.category.id_category : product.category,
      family: typeof product.family === 'object' ? product.family.id_family : product.family,
      laboratory: typeof product.laboratory === 'object' ? product.laboratory.id_laboratory : product.laboratory
    };
  }
}
