import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../core/services/admin';
import { HospedajeService } from '../../../../core/services/hospedaje';

@Component({
  selector: 'app-editar',
  imports: [],
  templateUrl: './editar.html',
  styleUrl: './editar.css'
})
export class EditarHospedaje {
  // Injects
  route = inject(ActivatedRoute);
  admin = inject(AdminService);

  hospedaje = this.admin.hospedaje;
  loading = this.admin.loading;
  error = this.admin.error;
  success = this.admin.success;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.admin.getHospedaje(id);
      }
    });
  }

  successEffect = effect(() => {
    const success = this.success();
    if (success) {
      console.log(this.hospedaje());
    }
  });
}
