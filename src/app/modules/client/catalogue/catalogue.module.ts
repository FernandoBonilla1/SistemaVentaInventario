import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueRoutingModule } from './catalogue-routing.module';
import { ConstructionComponent } from './construction/construction.component';
import { TerminationsComponent } from './terminations/terminations.component';
import { ToolsComponent } from './tools/tools.component';
import { DecorationComponent } from './decoration/decoration.component';
import { PipelinesComponent } from './pipelines/pipelines.component';


@NgModule({
  declarations: [
    ConstructionComponent,
    TerminationsComponent,
    ToolsComponent,
    DecorationComponent,
    PipelinesComponent
  ],
  imports: [
    CommonModule,
    CatalogueRoutingModule
  ]
})
export class CatalogueModule { }
