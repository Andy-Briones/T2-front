import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../model/product';
import { Category } from '../../model/category';
import { Family } from '../../model/family';
import { Laboratory } from '../../model/laboratory';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { FamilyService } from '../../services/family-service';
import { LaboratoryService } from '../../services/laboratory-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-product-component',
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    RouterOutlet,
    RouterLink,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css'
})
export class ProductComponent {
  dataSource: MatTableDataSource<Product>;
  columnsDefinitions = [
    { def: 'id_product', label: 'ID', hide: true },
    { def: 'name', label: 'Name', hide: false },
    { def: 'description', label: 'Description', hide: false },
    { def: 'presentation', label: 'Presentation', hide: false },
    { def: 'stock', label: 'Stock', hide: false },
    { def: 'unuit_price', label: 'Unit Price', hide: false },
    { def: 'expired', label: 'Expired', hide: false },
    { def: 'laboratory', label: 'Laboratory', hide: false },
    { def: 'category', label: 'Category', hide: false },
    { def: 'family', label: 'Family', hide: false },
    { def: 'actions', label: 'Actions', hide: false },
  ];

  categoria: Category[] = [];
  familia: Family[] = [];
  laboratorio: Laboratory[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private familyService: FamilyService,
    private laboratoryService: LaboratoryService,
    private dialog: MatDialog,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productService.findAll().subscribe(data => this.createTable(data));
    this.productService.getProductChange().subscribe(data => this.createTable(data));
    this.productService.getMessageChange().subscribe(msg =>
      this._snackbar.open(msg, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom' })
    );

    this.categoryService.findAll().subscribe(data => this.categoria = data);
    this.familyService.findAll().subscribe(data => this.familia = data);
    this.laboratoryService.findAll().subscribe(data => this.laboratorio = data);
  }

  createTable(data: Product[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(event: any) {
    this.dataSource.filter = event.target.value.trim();
  }

  updateProduct(row: Product) {
    this.productService.update(row.id_product!, row).subscribe(() => {
      this._snackbar.open('Product updated', 'OK', { duration: 1500 });
    });
  }
  updateCategory(row: Product, id_category: number) {
  row.category.id_category = id_category;
  this.updateProduct(row);
  }

  updateFamily(row: Product, id_family: number) {
    row.family.id_family = id_family;
    this.updateProduct(row);
  }

  updateLaboratory(row: Product, id_laboratory: number) {
    row.laboratory.id_laboratory = id_laboratory;
    this.updateProduct(row);
  }

  // Función para confirmar eliminación
  confirmDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Confirmar Delete',
        message: 'Estas seguro de borrar el producto?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(id); // Llama a tu función delete original
      }
    });
  }

  delete(id: number) {
    this.productService.delete(id)
      .pipe(switchMap(() => this.productService.findAll()))
      .subscribe(data => {
        this.productService.setProductChange(data);
        this.productService.setMessageChange('Product DELETED!');
      });
  }
}
