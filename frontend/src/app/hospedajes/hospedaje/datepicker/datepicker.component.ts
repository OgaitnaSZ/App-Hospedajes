import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaApiService } from '../../../services/reserva.api.service';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css'
})
export class DatepickerComponent {
  constructor(private reservaService: ReservaApiService){
    this.generateMonth();
  }
  @Input() idHospedaje: number | undefined; // ID recibido del componente padre
  excludedDates: Date[] = [];

  ngOnInit(): void {
    // Inicializar las fechas excluidas, solo mostrando fechas del mes actual en adelante
    const today = new Date();
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
    for (let d = new Date(today); d <= new Date(); d.setDate(d.getDate() + 1)) {
      this.excludedDates.push(new Date(d.getTime()));
    }
  }


  // Variables de estado
  currentDate: Date = new Date();
  days: Date[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  hoveredDate: Date | null = null;
  message: string = 'Selecciona la fecha de inicio';

  // Evento para emitir fechas seleccionadas
  @Output() datesSelected = new EventEmitter<{ start: Date, end: Date }>();

  // Genera todas las fechas del mes actual
  generateMonth() {
    const start = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    this.days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      this.days.push(new Date(d));
    }
  }

  // Verifica si una fecha está excluida
  isExcluded(date: Date): boolean {
    const today = new Date();
    return this.excludedDates.some(excludedDate => this.isSameDate(excludedDate, date)) || date < today;
  }
  
  

  // Verifica si una fecha está dentro del rango seleccionado
  isSelected(date: Date): boolean {
    if (!this.startDate || !this.endDate) {
      return false;
    }
    return date >= this.startDate && date <= this.endDate;
  }

  // Verifica si una fecha está siendo "hovered"
  isHovered(date: Date): boolean {
    if (!this.startDate || this.isExcluded(date) || !this.hoveredDate) {
      return false;
    }
    return date >= this.startDate && date <= this.hoveredDate;
  }

  // Maneja el evento de clic para seleccionar fechas
  selectDate(date: Date) {
    if (this.isExcluded(date)) return; // Si la fecha está excluida, no hacer nada
  
    if (!this.startDate || (this.startDate && this.endDate)) {
      // Reinicia si no hay fecha de inicio o si ambas fechas están seleccionadas
      this.startDate = date;
      this.endDate = null;
      this.message = 'Selecciona una fecha de salida';
    } else if (!this.endDate && date > this.startDate) {
      // Si se selecciona la fecha de fin y es válida
      const tempEndDate = date;
  
      if (this.isRangeValid(this.startDate, tempEndDate)) {
        this.endDate = tempEndDate;
        this.message = '';
        // Emitir las fechas seleccionadas al componente padre
        this.datesSelected.emit({ start: this.startDate, end: this.endDate });
      } else {
        this.message = 'El rango incluye días reservados. Selecciona otro rango.';
        this.startDate = null;
        this.endDate = null; // Resetea la fecha de fin si no es válida
      }
    }
  }
  

  // Maneja el hover
  onMouseEnter(date: Date) {
    if (!this.startDate || this.isExcluded(date)) {
      return;
    }
    this.hoveredDate = date;
  }

  onMouseLeave() {
    this.hoveredDate = null;
  }

  // Navega al mes anterior
  prevMonth(event: Event) {
    event.preventDefault();
  
    // Obtener el primer día del mes actual
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
    // Clonar la fecha actual y restarle un mes
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
  
    // Permitir retroceder solo si el nuevo mes no es anterior al mes actual
    if (newDate.getFullYear() > today.getFullYear() || 
        (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() >= today.getMonth())) {
      this.currentDate = newDate;
      this.generateMonth();
    }
  }

  // Navega al mes siguiente
  nextMonth(event: Event) {
    event.preventDefault();
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateMonth();
  }

  // Obtiene el nombre del mes
  getMonthName(date: Date): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[date.getMonth()];
  }

  isRangeValid(startDate: Date, endDate: Date): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (this.excludedDates.some(date => this.isSameDate(date, d))) {
        return false; // El rango incluye una fecha reservada
      }
    }
    return true; // El rango es válido
  }
  
  // Función para comparar fechas
  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
}
