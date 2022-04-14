import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    CatalogueComponent,
    ShoppingListComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }
