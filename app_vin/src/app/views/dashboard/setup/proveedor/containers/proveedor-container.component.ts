import { Proveedor } from '../models/proveedor';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorNewComponent } from '../components/form/proveedor-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProveedorEditComponent } from '../components/form/proveedor-edit.component';
import { ConfirmDialogService } from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import { ProveedoresListComponent } from "../components";
import {ProveedorService} from "../../../../../providers/services/setup/proveedor.service";


@Component({
    selector: 'app-proveedores-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ProveedoresListComponent, // Lista de proveedores
        ProveedorEditComponent,
        ProveedorNewComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-proveedores-list
            class="w-full"
            [proveedores]="proveedores"
            (eventNew)="handleNewProveedor()"
            (eventEdit)="handleEditProveedor($event)"
            (eventDelete)="handleDeleteProveedor($event)"
        ></app-proveedores-list>
    `,
})
export class ProveedorContainerComponent implements OnInit {
    public error: string = '';
    public proveedores: Proveedor[] = [];
    public proveedor = new Proveedor();

    constructor(
        private proveedorService: ProveedorService,
        private confirmDialogService: ConfirmDialogService,
        private matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.fetchProveedores();
    }

    /**
     * Obtiene todos los proveedores desde el servicio
     */
    fetchProveedores(): void {
        this.proveedorService.getAll$().subscribe(
            (response) => {
                this.proveedores = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    /**
     * Abre el formulario para crear un nuevo proveedor
     */
    handleNewProveedor(): void {
        const dialogRef = this.matDialog.open(ProveedorNewComponent, {
            data: { title: 'Nuevo Proveedor' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.addProveedor(result);
            }
        });
    }

    /**
     * Llama al servicio para añadir un nuevo proveedor
     */
    addProveedor(data: Proveedor): void {
        this.proveedorService.add$(data).subscribe(
            () => this.fetchProveedores(),
            (error) => console.error(error)
        );
    }

    /**
     * Obtiene un proveedor por su ID y abre el formulario de edición
     */
    handleEditProveedor(idProveedor: number): void {
        this.proveedorService.getById$(idProveedor).subscribe(
            (response) => {
                if (response) {
                    this.openEditModal(response);
                }
            },
            (error) => console.error(error)
        );
    }

    /**
     * Abre el modal de edición para el proveedor
     */
    openEditModal(data: Proveedor): void {
        const dialogRef = this.matDialog.open(ProveedorEditComponent, {
            data: { title: `Editar <b>${data.nombre || data.id}</b>`, proveedor: data },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.updateProveedor(data.id!, result);
            }
        });
    }

    /**
     * Llama al servicio para actualizar un proveedor
     */
    updateProveedor(idProveedor: number, data: Proveedor): void {
        this.proveedorService.update$(idProveedor, data).subscribe(
            () => this.fetchProveedores(),
            (error) => console.error(error)
        );
    }

    /**
     * Elimina un proveedor después de confirmar
     */
    handleDeleteProveedor(idProveedor: number): void {
        this.confirmDialogService.confirmDelete().then(() => {
            this.proveedorService.delete$(idProveedor).subscribe(
                () => this.fetchProveedores(),
                (error) => console.error(error)
            );
        }).catch(() => {});
    }
}
