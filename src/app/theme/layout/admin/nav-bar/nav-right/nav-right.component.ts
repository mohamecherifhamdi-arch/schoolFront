// Angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/theme.service';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  constructor(public theme: ThemeService) {}
  logout()
  {
  }
}
