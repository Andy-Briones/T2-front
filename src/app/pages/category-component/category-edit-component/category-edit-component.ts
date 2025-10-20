import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Category } from '../../../model/category';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-category-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './category-edit-component.html',
  styleUrl: './category-edit-component.css'
})
export class CategoryEditComponent {
form: FormGroup;
  id: number;
  isEdit: boolean;
  constructor(
    private route: ActivatedRoute, // Conocer el parametro que viene por la url
    private categoryService: CategoryService,
    private router: Router // Dirigirnos de un componente a otro
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      id_category: new FormControl(),
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
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }
  initForm() {
    if (this.isEdit) {
      this.categoryService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id_category: new FormControl(data.id_category),
          name: new FormControl(data.name),
          description: new FormControl(data.description),
        });
      });
    }
  }
  persist() {
    const category: Category = new Category();
    category.id_category = this.form.value['id_category'];
    category.name = this.form.value['name'];
    category.description = this.form.value['description'];

    if(this.isEdit){
      // UPDATE
      // this.patientService.update(this.id, patient).subscribe();
      // PRACTICA COMUN, NO IDEAL
      this.categoryService.update(this.id, category).subscribe(() => {
        this.categoryService.findAll().subscribe( data => {
          this.categoryService.setCategoryChange(data);
          this.categoryService.setMessageChange('Category UPDATED!');
        })
      });
    }else{
      // SAVE
      //this.patientService.save(patient).subscribe();
      // PRACTICA IDEAL
      this.categoryService.save(category)
        .pipe(switchMap( () => this.categoryService.findAll()))
        .subscribe( data => {
          this.categoryService.setCategoryChange(data);
          this.categoryService.setMessageChange('Category CREATED!');
        });
    }

    this.router.navigate(['pages/category']);
  }
}
