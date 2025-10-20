import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LaboratoryService } from '../../../services/laboratory-service';
import { Laboratory } from '../../../model/laboratory';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-laboratory-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './laboratory-edit-component.html',
  styleUrl: './laboratory-edit-component.css'
})
export class LaboratoryEditComponent {
form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // Conocer el parametro que viene por la url
    private laboratoryService: LaboratoryService,
    private router: Router // Dirigirnos de un componente a otro
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      id_laboratory: new FormControl(),

      name: new FormControl('',[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      eamil: new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      address: new FormControl('',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255)
      ]),
      phone: new FormControl('',[
        Validators.required,
        Validators.maxLength(9)
      ])
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }
  initForm() {
    if (this.isEdit) {
      this.laboratoryService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id_laboratory: new FormControl(data.id_laboratory),
          name: new FormControl(data.name),
          eamil: new FormControl(data.eamil),
          address: new FormControl(data.address),
          phone: new FormControl(data.phone),
        });
      });
    }
  }
  persist() {
    const laboratory: Laboratory = new Laboratory();
    laboratory.id_laboratory = this.form.value['id_laboratory'];
    laboratory.name = this.form.value['name'];
    laboratory.eamil = this.form.value['eamil'];
    laboratory.address = this.form.value['address'];
    laboratory.phone = this.form.value['phone'];

    if(this.isEdit){
      // UPDATE
      // this.patientService.update(this.id, patient).subscribe();
      // PRACTICA COMUN, NO IDEAL
      this.laboratoryService.update(this.id, laboratory).subscribe(() => {
        this.laboratoryService.findAll().subscribe( data => {
          this.laboratoryService.setLaboratoryChange(data);
          this.laboratoryService.setMessageChange('Laboratory UPDATED!');
        })
      });
    }else{
      // SAVE
      //this.patientService.save(patient).subscribe();
      // PRACTICA IDEAL
      this.laboratoryService.save(laboratory)
        .pipe(switchMap( () => this.laboratoryService.findAll()))
        .subscribe( data => {
          this.laboratoryService.setLaboratoryChange(data);
          this.laboratoryService.setMessageChange('Laboratory CREATED!');
        });
    }

    this.router.navigate(['pages/laboratory']);
  }
}
