import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { FaqComponent } from './components/faq/faq.component';
import { FeaturesComponent } from './components/features/features.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { TodoSingleComponent } from './components/todo-single/todo-single.component';
import { TodoUpdateComponent } from './components/todo-update/todo-update.component';
import { TodoComponent } from './components/todo/todo.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: TodoComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'todo', component: TodoComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'todo/update', component: TodoComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'todo/:id', component: TodoSingleComponent },
  { path: 'todo/update/:id', component: TodoUpdateComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
