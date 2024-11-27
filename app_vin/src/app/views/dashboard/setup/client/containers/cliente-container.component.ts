import { Client } from '../models/cliente';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientNewComponent } from '../components/form/cliente-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientEditComponent } from '../components/form/cliente-edit.component';
import { ConfirmDialogService } from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import { ClientListComponent } from '../components';
import { ClienteService } from "../../../../../providers/services/setup/cliente.service";

@Component({
    selector: 'app-clients-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ClientListComponent,
        ClientNewComponent,
        ClientEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-clients-list
            class="w-full"
            [clients]="clients"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"
            (eventDelete)="eventDelete($event)"
        ></app-clients-list>
    `,
})
export class ClientContainerComponent implements OnInit {
    public error: string = '';
    public clients: Client[] = [];
    public client: Client = new Client();

    constructor(
        private _clientService: ClienteService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {}

    ngOnInit() {
        this.getClients();
    }

    getClients(): void {
        this._clientService.getAll$().subscribe(
            (response) => {
                this.clients = response;
            },
            (error) => {
                this.error = 'Error al cargar clientes: ' + error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(ClientNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Cliente';
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }

    saveClient(data: Object): void {
        this._clientService.add$(data).subscribe(
            (response) => {
                this.clients.push(response); // Añadir el cliente recién creado a la lista
            },
            (error) => {
                this.error = 'Error al guardar el cliente: ' + error;
            }
        );
    }

    eventEdit(idClient: number): void {
        this._clientService.getById$(idClient).subscribe(
            (response) => {
                this.client = response || new Client();
                this.openModalEdit(this.client);
            },
            (error) => {
                this.error = 'Error al obtener el cliente: ' + error;
            }
        );
    }

    openModalEdit(data: Client): void {
        if (data) {
            const clienteForm = this._matDialog.open(ClientEditComponent);
            clienteForm.componentInstance.title = `Editar Cliente: ${data.nombre || data.id}`;
            clienteForm.componentInstance.client = data;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editClient(data.id, result);
                }
            });
        }
    }

    editClient(idClient: number, data: Object): void {
        this._clientService.update$(idClient, data).subscribe(
            (response) => {
                const index = this.clients.findIndex(client => client.id === idClient);
                if (index > -1) {
                    this.clients[index] = response; // Actualiza el cliente en la lista
                }
            },
            (error) => {
                this.error = 'Error al editar el cliente: ' + error;
            }
        );
    }

    public eventDelete(idClient: number): void {
        this._confirmDialogService.confirmDelete({
            message: '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.'
        }).then(() => {
            this._clientService.delete$(idClient).subscribe({
                next: () => {
                    // Primero eliminar el cliente localmente
                    this.clients = this.clients.filter(client => client.id !== idClient);
                    // O si prefieres mantener la sincronización con el backend:
                    // this.getClients();
                },
                error: (error) => {
                    this.error = 'Error al eliminar el cliente: ' + error;
                }
            });
        }).catch(() => {
            // No hacer nada si el usuario cancela
        });
    }
}
