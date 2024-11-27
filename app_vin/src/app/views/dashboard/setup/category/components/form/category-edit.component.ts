import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../models/category';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-category-edit',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium" [innerHTML]="title"></div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Formulario de edición de categoría -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="categoryForm">
                <!-- Campo para el nombre -->
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="nombre" />
                    <mat-error *ngIf="categoryForm.get('nombre')?.hasError('required')">
                        El nombre es obligatorio.
                    </mat-error>
                </mat-form-field>

                <!-- Campo para la descripción (opcional) -->
                <mat-form-field>
                    <mat-label>Descripción</mat-label>
                    <input matInput formControlName="discripcion" />
                    <mat-error *ngIf="categoryForm.get('discripcion')?.hasError('required')">
                        La descripción es opcional.
                    </mat-error>
                </mat-form-field>

                <!-- Campo para el código (obligatorio) -->
                <mat-form-field>
                    <mat-label>Código</mat-label>
                    <input matInput formControlName="codigo" type="number" />
                    <mat-error *ngIf="categoryForm.get('codigo')?.hasError('required')">
                        El código es obligatorio.
                    </mat-error>
                </mat-form-field>

                <!-- Acciones -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0 ml-auto">
                        <button mat-stroked-button [color]="'warn'" (click)="cancelForm()">Cancelar</button>
                        <button mat-stroked-button [color]="'primary'" (click)="saveForm()" [disabled]="categoryForm.invalid">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class CategoryEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() category: Category = new Category(); // Categoria a editar

    categoryForm: FormGroup; // Formulario de categoría

    constructor(
        private formBuilder: FormBuilder,
        private _matDialog: MatDialogRef<CategoryEditComponent>
    ) {}

    ngOnInit() {
        // Inicializamos el formulario con los campos de nombre, descripción y código
        if (this.category && this.category.id) {
            this.categoryForm = new FormGroup({
                nombre: new FormControl(this.category.nombre || '', [Validators.required]),
                discripcion: new FormControl(this.category.discripcion || '', []), // Manteniendo discripcion
                codigo: new FormControl(this.category.codigo || '', [Validators.required]),
            });
        } else {
            this.categoryForm = new FormGroup({
                nombre: new FormControl('', [Validators.required]),
                discripcion: new FormControl('', []), // Manteniendo discripcion
                codigo: new FormControl('', [Validators.required]),
            });
        }
    }

    // Guardamos el formulario si es válido
    public saveForm(): void {
        if (this.categoryForm.valid) {
            const formData = this.categoryForm.value;
            console.log('Datos guardados: ', formData); // Verificar los datos antes de cerrar el diálogo
            this._matDialog.close(formData); // Cierra el diálogo con los datos del formulario
        } else {
            console.log('Formulario inválido');
        }
    }

    // Cancelamos y cerramos el formulario sin guardar cambios
    public cancelForm(): void {
        this._matDialog.close(''); // Cierra el diálogo sin pasar ningún dato
    }
}
