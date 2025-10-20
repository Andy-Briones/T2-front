import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { CategoryService } from '../../../services/category-service';
import { FamilyService } from '../../../services/family-service';
import { LaboratoryService } from '../../../services/laboratory-service';
import { Product } from '../../../model/product';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSelectModule,
    CommonModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './product-edit-component.html',
  styleUrl: './product-edit-component.css'
})
export class ProductEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  categoria: any[] = [];
  familia: any[] = [];
  laboratorio: any[] = [];

  constructor(
    private route: ActivatedRoute, // Conocer el parametro que viene por la url
    private productService: ProductService,
    private categoryService: CategoryService,
    private familyService: FamilyService,
    private laboratoryService: LaboratoryService,
    private router: Router // Dirigirnos de un componente a otro
  ) {}
  ngOnInit(): void {
   this.form = new FormGroup({
    id_product: new FormControl(),
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    description: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    presentation: new FormControl('',[
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    stock: new FormControl(0,[
      Validators.required,
      Validators.min(0)
    ]),
    unuit_price: new FormControl(0,[
      Validators.required,
      Validators.min(1)
    ]),
    expired: new FormControl('',[
      Validators.required
    ]),
    id_laboratory: new FormControl(null, [
      Validators.required
    ]),
    id_category: new FormControl(null,[
      Validators.required
    ]),
    id_family: new FormControl(null,[
      Validators.required
    ]),
});

    this.loadCategories();
    this.loadFamilies();
    this.loadLaboratories();

    this.route.params.subscribe(params=> {
      this.id = params['id'];
      this.isEdit = this.id != null;
      this.initForm();
    });
  }
  initForm() {
    if (this.isEdit) {
      this.productService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          id_product: data.id_product,
          name: data.name,
          description: data.description,
          presentation: data.presentation,
          stock: data.stock,
          unuit_price: data.unuit_price,
          expired: data.expired,
          id_category: data.category?.id_category,
          id_family: data.family?.id_family,
          id_laboratory: data.laboratory?.id_laboratory
        });
      });
    }
  }

  // 📥 Cargar categorías
  loadCategories() {
    this.categoryService.findAll().subscribe((data) => {
      // console.log('Categorias cargados:', data);
      this.categoria = data;
    });
  }

  // 📥 Cargar familias
  loadFamilies() {
    this.familyService.findAll().subscribe((data) => {
      this.familia = data;
    });
  }

  // 📥 Cargar laboratorios
  loadLaboratories() {
    this.laboratoryService.findAll().subscribe((data) => {
      this.laboratorio = data;
    });
  }

  persist() {
    const product: Product = new Product();
    product.id_product = this.form.value['id_product'];
    product.name = this.form.value['name'];
    product.description = this.form.value['description'];
    product.presentation = this.form.value['presentation'];
    product.stock = this.form.value['stock'];
    product.unuit_price = this.form.value['unuit_price'];
    // product.expired = this.form.value['expired'];
    product.expired = this.form.value['expired']
    ? new Date(this.form.value['expired']).toISOString().split('T')[0]
    : null;
    product.laboratory = this.form.value['id_laboratory'];
    product.category = this.form.value['id_category'];
    product.family = this.form.value['id_family'];
    

    if(this.isEdit){
      // UPDATE
      // this.patientService.update(this.id, patient).subscribe();
      // PRACTICA COMUN, NO IDEAL
      this.productService.update(this.id, product).subscribe(() => {
        this.productService.findAll().subscribe( data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('Product UPDATED!');
        })
      });
    }else{
      // SAVE
      //this.patientService.save(patient).subscribe();
      // PRACTICA IDEAL
      console.log('📤 Objeto que se envía:', product);
      this.productService.save(product)
        .pipe(switchMap( () => this.productService.findAll()))
        .subscribe( data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('Product CREATED!');
        });
    }

    this.router.navigate(['pages/product']);
  }
}
