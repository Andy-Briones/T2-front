import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterOutlet, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-category-component',
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
  templateUrl: './category-component.html',
  styleUrl: './category-component.css'
})
export class CategoryComponent {
dataSource: MatTableDataSource<Category>;
  // displayedColumns: string[] = ['idPatient','dni', 'firstName', 'lastName','phone','email','address'];
  columnsDefinitions = [
    { def: 'id_category', label: 'id_category', hide: true },
    { def: 'name', label: 'name', hide: false },
    { def: 'description', label: 'description', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private categoryService: CategoryService,
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
    this.categoryService.findAll().subscribe(data => this.createTable(data));
    this.categoryService.getCategoryChange().subscribe(data => this.createTable(data));
    this.categoryService.getMessageChange().subscribe(data => 
      this._snackbar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition:'bottom'
      })
    );
  }
  createTable(data: Category[]) {
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
    this.categoryService.delete(id)
    .pipe(switchMap(()=>this.categoryService.findAll()))
    .subscribe( data => {
      this.categoryService.setCategoryChange(data);
      this.categoryService.setMessageChange('Category DELETED!');
    });
  }
}
