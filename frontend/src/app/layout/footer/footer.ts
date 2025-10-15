import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html'
})
export class Footer {
  // Signals de estado
  email = signal<string>('');
  isLoading = signal<boolean>(false);
  message = signal<string>('');
  
  // Signals computados (reactivos)
  emailError = computed(() => {
    const emailValue = this.email();
    if (!emailValue) return 'El email es requerido';
    if (!this.isValidEmail(emailValue)) return 'Email no válido';
    return null;
  });
  
  canSubscribe = computed(() => {
    return this.email() && !this.emailError() && !this.isLoading();
  });

  constructor(private userService: UserService) {}

  onEmailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
    // Limpiar mensaje cuando el usuario empiece a escribir
    if (this.message()) {
      this.message.set('');
    }
  }

  // Suscribirse
  async subscribe(): Promise<void> {
    console.log(this.email());
    if (!this.canSubscribe()) return;
    
    this.isLoading.set(true);
    this.message.set('');
    
    try {
      const success = await this.userService.subscribeEmail(this.email());
      
      if (success) {
        this.message.set('¡Gracias por suscribirte!');
        this.email.set(''); // Limpiar el email
      } else {
        this.message.set('Error al suscribirse. Intenta nuevamente.');
      }
    } catch (error) {
      this.message.set('Error al suscribirse. Intenta nuevamente.');
      console.error('Error en suscripción:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
