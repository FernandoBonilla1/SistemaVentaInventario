import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from 'src/app/shared/nav-bar/nav-bar.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { ProfileComponent } from './profile/profile.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [
  {
    path: '',
    component: NavBarComponent,
    children: [
      { path: 'catalogo', loadChildren: () => import('./catalogue/catalogue.module').then(m => m.CatalogueModule)},
      { path: 'lista-compras', component: ShoppingListComponent },
      { path: 'perfil', component: ProfileComponent },
      { path: '**', redirectTo: 'catalogo'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
