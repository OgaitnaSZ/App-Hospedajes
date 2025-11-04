import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user';
import { Rol, User } from '../../../core/interfaces/user.model';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  // Inyects
  auth = inject(AuthService);
  user = inject(UserService);
  fb = inject(FormBuilder);

  userData = this.auth.currentUser;
  loading = this.user.loading;
  error = this.user.error;
  success = this.user.success;

  // Campos del formulario
  formData = this.fb.nonNullable.group({
    idUsuario: this.userData()?.idUsuario ?? '',
    rol: this.userData()?.rol ?? Rol.Huesped,
    nombre: this.userData()?.nombre ?? '',
    apellido: this.userData()?.apellido ?? '',
    telefono: this.userData()?.telefono ?? '',
    email: this.userData()?.email ?? '',
    password: ['', Validators.required]
  });

  formPassword = this.fb.nonNullable.group({
    idUsuario: this.userData()?.idUsuario,
    password: ['', Validators.required],
    newPassword: ['', Validators.required],
    newPasswordConfirm: ['', Validators.required]
  });

  ngOnInit(): void {
    console.log(this.userData());
  }

  guardarDatos(): void {
    if (this.formData.invalid) return this.error.set('Faltan datos.');
    const formValue = this.formData.getRawValue();

    this.user.updateUserData(formValue);
  }

  guardarPassword(): void {
    if (this.formPassword.invalid) return this.error.set('Faltan datos.');
    const formValue = this.formPassword.getRawValue();
    console.log('Datos a actualizar:', formValue);

    const { password, newPassword } = formValue;

    if(this.formPassword.value.newPassword === this.formPassword.value.newPasswordConfirm){
      this.auth.actualizarPassword(password, newPassword);
    }else{
      return this.error.set("Las nuevas contraseñas no coinciden");
    }
  }  
  
  successEffect = effect(() => {
    const success = this.success();
    if (success) {
      const formValue = this.formData.getRawValue();
      this.auth.user.set(formValue)
      console.log("User cambiado", this.auth.currentUser());
    }
  });

}
