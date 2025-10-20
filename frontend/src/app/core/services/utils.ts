import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
    obtenerEstrellas(cantidad: number | undefined) : number[]{
        return Array.from({ length: cantidad ?? 0 }, () => 1);        
    }
}