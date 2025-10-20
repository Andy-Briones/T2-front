import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FamilyService } from '../../../services/family-service';
import { Family } from '../../../model/family';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-family-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './family-edit-component.html',
  styleUrl: './family-edit-component.css'
})
export class FamilyEditComponent {
form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // Conocer el parametro que viene por la url
    private familyService: FamilyService,
    private router: Router // Dirigirnos de un componente a otro
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      id_family: new FormControl(),

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
      this.familyService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id_family: new FormControl(data.id_family),
          name: new FormControl(data.name),
          description: new FormControl(data.description),
        });
      });
    }
  }
  persist() {
    const family: Family = new Family();
    family.id_family = this.form.value['id_family'];
    family.name = this.form.value['name'];
    family.description = this.form.value['description'];

    if(this.isEdit){
      // UPDATE
      // this.patientService.update(this.id, patient).subscribe();
      // PRACTICA COMUN, NO IDEAL
      this.familyService.update(this.id, family).subscribe(() => {
        this.familyService.findAll().subscribe( data => {
          this.familyService.setFamilyChange(data);
          this.familyService.setMessageChange('Family UPDATED!');
        })
      });
    }else{
      // SAVE
      //this.patientService.save(patient).subscribe();
      // PRACTICA IDEAL
      this.familyService.save(family)
        .pipe(switchMap( () => this.familyService.findAll()))
        .subscribe( data => {
          this.familyService.setFamilyChange(data);
          this.familyService.setMessageChange('Family CREATED!');
        });
    }

    this.router.navigate(['pages/family']);
  }
}
