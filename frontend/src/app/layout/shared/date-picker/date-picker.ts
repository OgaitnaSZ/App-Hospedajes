import { Component, Input, Output, EventEmitter, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../core/services/reserva';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css'
})
export class Datepicker {
  readonly reservaService = inject(ReservaService);
  
  // Inputs y Outputs
  @Input() idHospedaje: string | undefined;
  @Output() datesSelected = new EventEmitter<{ start: Date, end: Date }>();

  // Signals reactivas
  currentDate = signal(new Date());
  excludedDates = signal<Date[]>([]);
  days = signal<Date[]>([]);
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  hoveredDate = signal<Date | null>(null);
  message = signal('Selecciona la fecha de inicio');

  // Computed signals
  monthName = computed(() => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const date = this.currentDate();
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  });

  selectedRange = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    return start && end ? { start, end } : null;
  });

  ngOnInit(): void {
    this.initExcludedDates();
    this.generateMonth();
  }

  private initExcludedDates(): void {
    const today = new Date();
    const excluded: Date[] = [];
    for (let d = new Date(today); d <= new Date(); d.setDate(d.getDate() + 1)) {
      excluded.push(new Date(d.getTime()));
    }
    this.excludedDates.set(excluded);
  }

  private generateMonth(): void {
    const start = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 1);
    const end = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1, 0);
    const days: Date[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    this.days.set(days);
  }

  // Helpers
  private isSameDate(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  isExcluded(date: Date): boolean {
    const today = new Date();
    return this.excludedDates().some(ex => this.isSameDate(ex, date)) || date < today;
  }

  isSelected(date: Date): boolean {
    const start = this.startDate();
    const end = this.endDate();
    return start && end ? date >= start && date <= end : false;
  }

  isHovered(date: Date): boolean {
    const start = this.startDate();
    const hovered = this.hoveredDate();
    return !!(start && hovered && date >= start && date <= hovered && !this.isExcluded(date));
  }

  private isRangeValid(start: Date, end: Date): boolean {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (this.excludedDates().some(ex => this.isSameDate(ex, d))) {
        return false;
      }
    }
    return true;
  }

  // Eventos
  selectDate(date: Date): void {
    if (this.isExcluded(date)) return;

    const start = this.startDate();
    const end = this.endDate();

    if (!start || (start && end)) {
      this.startDate.set(date);
      this.endDate.set(null);
      this.message.set('Selecciona una fecha de salida');
      return;
    }

    if (date > start) {
      if (this.isRangeValid(start, date)) {
        this.endDate.set(date);
        this.message.set('');
        this.datesSelected.emit({ start, end: date });
      } else {
        this.message.set('El rango incluye días reservados. Selecciona otro rango.');
        this.startDate.set(null);
        this.endDate.set(null);
      }
    }
  }

  onMouseEnter(date: Date): void {
    if (!this.startDate() || this.isExcluded(date)) return;
    this.hoveredDate.set(date);
  }

  onMouseLeave(): void {
    this.hoveredDate.set(null);
  }

  prevMonth(event: Event): void {
    event.preventDefault();
    const today = new Date();
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() - 1);

    if (
      newDate.getFullYear() > today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() >= today.getMonth())
    ) {
      this.currentDate.set(newDate);
      this.generateMonth();
    }
  }

  nextMonth(event: Event): void {
    event.preventDefault();
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentDate.set(newDate);
    this.generateMonth();
  }
}
