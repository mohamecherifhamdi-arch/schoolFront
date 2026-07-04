import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { authGuard } from './theme/shared/_helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/default',
        pathMatch: 'full'
      },
      {
        path: 'default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'absences',
        loadComponent: () => import('./demo/elements/absence/absence.component').then((c) => c.AbsenceComponent)
      },
      {
        path: 'salles',
        loadComponent: () => import('./demo/elements/salles/salles.component').then((c) => c.SallesComponent)
      },
      {
        path: 'enseignants',
        loadComponent: () => import('./demo/elements/enseignants/enseignants.component').then((c) => c.EnseignantsComponent)
      },
      {
        path: 'eleves',
        loadComponent: () => import('./demo/elements/eleves/eleves.component').then((c) => c.ElevesComponent)
      },
      {
        path:'marketplaces',
        loadComponent: () => import('./demo/elements/marketplaces/marketplaces.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'parents',
        loadComponent: () => import('./demo/elements/parents/parents.component').then((c) => c.ParentsComponent)
      },
      {
        path: 'planning-enseignants',
        loadComponent: () => import('./demo/elements/planning-enseignants/planning-enseignants.component').then((c) => c.PlanningEnseignantsComponent)
      },
      {
        path: 'matieres',
        loadComponent: () => import('./demo/elements/matieres/matieres.component').then((c) => c.MatieresComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
        {
        path: 'claims',
        loadComponent: () => import('./demo/elements/claims/claims.component').then((c) => c.ClaimsComponent)
      },
      {
        path: 'reclamation',
        loadComponent: () => import('./demo/elements/reclamation/reclamation.component').then((c) => c.ReclamationComponent)
      },
  {
         path: 'notes',
         loadComponent: () => import('./demo/elements/notes/notes.component').then((c) => c.NotesComponent)
       },
   {
          path: 'teacher-dashboard',
          loadComponent: () => import('./demo/elements/teacher-dashboard/teacher-dashboard.component').then((c) => c.TeacherDashboardComponent)
        },
   {
          path: 'validation',
        loadComponent: () => import('./demo/elements/validation/validation.component')
      },
      {
        path: 'payments',
        loadComponent: () => import('./demo/elements/payments/payments.component').then((c) => c.PaymentsComponent)
      },
   
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
