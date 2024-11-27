import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { END_POINTS, EntityDataService, IResponse } from '../../utils'; // Asegúrate de que estos archivos existan y estén configurados correctamente.

@Injectable({
    providedIn: 'root',
})
export class ProveedorService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.proveedor); // URL base configurada en END_POINTS
    }
}
