import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructionComponent } from './construction/construction.component';
import { DecorationComponent } from './decoration/decoration.component';
import { TerminationsComponent } from './terminations/terminations.component';
import { ToolsComponent } from './tools/tools.component';
import { PipelinesComponent } from './pipelines/pipelines.component';
import { CatalogueComponent } from './catalogue.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CatalogueComponent },
      { path: 'construccion', component: ConstructionComponent },
      { path: 'terminaciones', component: TerminationsComponent },
      { path: 'herramientas', component: ToolsComponent },
      { path: 'decoracion', component: DecorationComponent },
      { path: 'pipelines', component: PipelinesComponent },
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
