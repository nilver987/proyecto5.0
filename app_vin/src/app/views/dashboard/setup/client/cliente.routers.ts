import { Routes } from '@angular/router';
import { ClientContainerComponent } from "./containers/cliente-container.component";  // Asegúrate de tener este componente
import { ClienteComponent } from "./cliente.component";  // Asegúrate de tener este componente

export default [
    {
        path: '', // Ruta base
        component: ClienteComponent, // Componente padre
        children: [
            {
                path: '', // Ruta vacía para cargar el componente hijo dentro del padre
                component: ClientContainerComponent, // Componente hijo
                data: {
                    title: 'Cliente', // Título de la página o metadatos
                }
            },
        ],
    },
] as Routes;
