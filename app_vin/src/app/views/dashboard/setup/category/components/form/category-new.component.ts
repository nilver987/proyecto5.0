import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-categories-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">{{ title }}</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="categoryForm">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="nombre" />
                    <mat-error *ngIf="categoryForm.get('nombre')?.hasError('required')">
                        El nombre es obligatorio.
                    </mat-error>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Descripción</mat-label>
                    <input matInput formControlName="discripcion" />
                    <!-- Este campo es opcional, por lo que no tendrá un mensaje de error obligatorio -->
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Código</mat-label>
                    <input matInput formControlName="codigo" type="number" />
                    <mat-error *ngIf="categoryForm.get('codigo')?.hasError('required')">
                        El código es obligatorio.
                    </mat-error>
                    <mat-error *ngIf="categoryForm.get('codigo')?.hasError('min')">
                        El código debe ser un valor mayor o igual a 0.
                    </mat-error>
                </mat-form-field>

                <!-- Actions -->
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
export class CategoryNewComponent implements OnInit {
    @Input() title: string = ''; // Título que se pasará al componente
    categoryForm: FormGroup;

    constructor(private _matDialog: MatDialogRef<CategoryNewComponent>) {}

    ngOnInit(): void {
        // Inicializa el formulario con las validaciones
        this.categoryForm = new FormGroup({
            nombre: new FormControl('', [Validators.required]), // Validación para nombre (obligatorio)
            discripcion: new FormControl(''), // No tiene validación 'required', es opcional
            codigo: new FormControl('', [Validators.required, Validators.min(0)]), // Validación para código (obligatorio y mayor que 0)
        });
    }

    // Método para guardar los datos del formulario
    public saveForm(): void {
        if (this.categoryForm.valid || !this.categoryForm.get('discripcion')?.value) {
            this._matDialog.close(this.categoryForm.value); // Cierra el diálogo y pasa los datos del formulario
        }
    }

    // Método para cancelar la acción y cerrar el diálogo sin cambios
    public cancelForm(): void {
        this._matDialog.close(''); // Cierra el diálogo sin realizar ninguna acción
    }
}
