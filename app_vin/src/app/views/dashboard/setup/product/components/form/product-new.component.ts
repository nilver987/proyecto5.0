import { Component, Input, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Para sanear las imágenes

@Component({
    selector: 'app-product-new',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">{{ title }}</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="productForm">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="nombre" />
                    <mat-error *ngIf="productForm.get('nombre')?.hasError('required')">
                        El nombre es obligatorio.
                    </mat-error>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Modelo</mat-label>
                    <input matInput formControlName="modelo" />
                    <mat-error *ngIf="productForm.get('modelo')?.hasError('required')">
                        El modelo es obligatorio.
                    </mat-error>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Código</mat-label>
                    <input matInput type="number" formControlName="codigo" />
                    <mat-error *ngIf="productForm.get('codigo')?.hasError('required')">
                        El código es obligatorio.
                    </mat-error>
                    <mat-error *ngIf="productForm.get('codigo')?.hasError('min')">
                        El código debe ser mayor o igual a 0.
                    </mat-error>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Precio</mat-label>
                    <input matInput type="number" formControlName="precio" />
                    <mat-error *ngIf="productForm.get('precio')?.hasError('required')">
                        El precio es obligatorio.
                    </mat-error>
                    <mat-error *ngIf="productForm.get('precio')?.hasError('min')">
                        El precio debe ser mayor o igual a 0.
                    </mat-error>
                </mat-form-field>

                <!-- Imagen -->
                <div class="flex flex-col">
                    <label for="imagen" class="mb-2">Imagen (Máx. 2MB)</label>
                    <input
                        type="file"
                        id="imagen"
                        (change)="onImageSelected($event)"
                        accept="image/*"
                        class="mb-2"
                    />
                    <div *ngIf="imagePreview" class="mt-4">
                        <img
                            [src]="imagePreview"
                            alt="Vista previa de la imagen"
                            class="max-h-40 rounded"
                        />
                        <button
                            type="button"
                            mat-stroked-button
                            color="warn"
                            class="mt-2"
                            (click)="removeImage()"
                        >
                            Eliminar imagen
                        </button>
                    </div>
                    <mat-error *ngIf="imageError">{{ imageError }}</mat-error>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0 ml-auto">
                        <button mat-stroked-button [color]="'warn'" (click)="cancelForm()">Cancelar</button>
                        <button mat-stroked-button [color]="'primary'" (click)="saveForm()" [disabled]="productForm.invalid">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class ProductNewComponent implements OnInit {
    @Input() title: string = 'Nuevo Producto';

    productForm: FormGroup = new FormGroup({
        nombre: new FormControl('', [Validators.required]),
        modelo: new FormControl('', [Validators.required]),
        codigo: new FormControl(null, [Validators.required, Validators.min(0)]),
        precio: new FormControl(null, [Validators.required, Validators.min(0)]),
        imagen: new FormControl(null), // Imagen opcional
    });

    imagePreview: SafeUrl | null = null;
    imageError: string | null = null;
    private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    constructor(private _matDialog: MatDialogRef<ProductNewComponent>, private sanitizer: DomSanitizer) {}

    ngOnInit(): void {}

    // Selección de la imagen
    onImageSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            if (this.validateFile(file)) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
                    this.productForm.patchValue({ imagen: reader.result });
                };
                reader.readAsDataURL(file);
            }
        }
    }

    // Validar el tamaño de la imagen
    private validateFile(file: File): boolean {
        this.imageError = null;
        if (file.size > this.MAX_FILE_SIZE) {
            this.imageError = 'La imagen no debe superar los 2MB';
            return false;
        }
        return true;
    }

    // Eliminar la imagen
    removeImage(): void {
        this.imagePreview = null;
        this.imageError = null;
        this.productForm.patchValue({ imagen: null });
        const fileInput = document.getElementById('imagen') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    // Guardar formulario
    saveForm(): void {
        if (this.productForm.valid) {
            this._matDialog.close(this.productForm.value);
        }
    }

    // Cancelar formulario
    cancelForm(): void {
        this._matDialog.close(null);
    }
}
