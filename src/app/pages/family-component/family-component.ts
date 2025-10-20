import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Family } from '../../model/family';
import { FamilyService } from '../../services/family-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-family-component',
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
  templateUrl: './family-component.html',
  styleUrl: './family-component.css'
})
export class FamilyComponent {
dataSource: MatTableDataSource<Family>;
  // displayedColumns: string[] = ['idPatient','dni', 'firstName', 'lastName','phone','email','address'];
  columnsDefinitions = [
    { def: 'id_family', label: 'id_family', hide: true },
    { def: 'name', label: 'name', hide: false },
    { def: 'description', label: 'description', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private familySerive: FamilyService,
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
    this.familySerive.findAll().subscribe(data => this.createTable(data));
    this.familySerive.getFamilyChange().subscribe(data => this.createTable(data));
    this.familySerive.getMessageChange().subscribe(data => 
      this._snackbar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition:'bottom'
      })
    );
  }
  createTable(data: Family[]) {
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
    this.familySerive.delete(id)
    .pipe(switchMap(()=>this.familySerive.findAll()))
    .subscribe( data => {
      this.familySerive.setFamilyChange(data);
      this.familySerive.setMessageChange('Family DELETED!');
    });
  }
}
