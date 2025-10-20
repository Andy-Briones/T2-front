import { Routes } from '@angular/router';
import { PatientComponent } from './pages/patient-component/patient-component';
import { Product } from './model/product';
import { ProductComponent } from './pages/product-component/product-component';
import { LaboratoryComponent } from './pages/laboratory-component/laboratory-component';
import { FamilyComponent } from './pages/family-component/family-component';
import { CategoryComponent } from './pages/category-component/category-component';
import { CategoryEditComponent } from './pages/category-component/category-edit-component/category-edit-component';
import { FamilyEditComponent } from './pages/family-component/family-edit-component/family-edit-component';
import { LaboratoryEditComponent } from './pages/laboratory-component/laboratory-edit-component/laboratory-edit-component';
import { PatientEditComponent } from './pages/patient-component/patient-edit-component/patient-edit-component';
import { ProductEditComponent } from './pages/product-component/product-edit-component/product-edit-component';

export const routes: Routes = [
    { path: 'pages/patient', component: PatientComponent,
        children: [
            { path: 'new', component: PatientEditComponent },
            { path: 'edit/:id', component: PatientEditComponent }
        ]
    },
    { path: 'pages/category', component: CategoryComponent, 
        children:[
            {path: 'new', component: CategoryEditComponent},
            { path: 'edit/:id', component: CategoryEditComponent }
        ]
    },
    { path: 'pages/laboratory', component: LaboratoryComponent,
        children: [
            {path: 'new', component: LaboratoryEditComponent},
            {path: 'edit/:id', component: LaboratoryEditComponent}
        ]
    },
    {path: 'pages/family', component: FamilyComponent,
        children: [
            {path: 'new', component: FamilyEditComponent},
            {path: 'edit/:id', component: FamilyEditComponent}
        ]
    },
    {path:'pages/product', component: ProductComponent,
        children: [
            {path: 'new', component: ProductEditComponent},
            {path: 'edit/:id', component: ProductEditComponent}
        ]
    }
];
