import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Laboratory } from '../../model/laboratory';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LaboratoryService } from '../../services/laboratory-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-laboratory-component',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './laboratory-component.html',
  styleUrl: './laboratory-component.css'
})
export class LaboratoryComponent {
dataSource: MatTableDataSource<Laboratory>;
  // displayedColumns: string[] = ['idPatient','dni', 'firstName', 'lastName','phone','email','address'];
  columnsDefinitions = [
    { def: 'id_laboratory', label: 'id_laboratory', hide: true },
    { def: 'name', label: 'name', hide: false },
    { def: 'eamil', label: 'eamil', hide: false },
    { def: 'address', label: 'addres', hide: false },
    { def: 'phone', label: 'phone', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private laboratoryService: LaboratoryService,
    private _snackbar: MatSnackBar
  ) {}

  //patron subscribe
  ngOnInit(): void {
    // this.patientService.findAll().subscribe(data => console.log(data));
    // this.patientService.findAll().subscribe(data => this.patients = data);

    /*this.patientService.findAll().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });*/
    this.laboratoryService.findAll().subscribe(data => this.createTable(data));
    this.laboratoryService.getLaboratoryChange().subscribe(data => this.createTable(data));
    this.laboratoryService.getMessageChange().subscribe(data => 
      this._snackbar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition:'bottom'
      })
    );
  }
  createTable(data: Laboratory[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number){
    this.laboratoryService.delete(id)
    .pipe(switchMap(()=>this.laboratoryService.findAll()))
    .subscribe( data => {
      this.laboratoryService.setLaboratoryChange(data);
      this.laboratoryService.setMessageChange('Laboratory DELETED!');
    });
  }
}
