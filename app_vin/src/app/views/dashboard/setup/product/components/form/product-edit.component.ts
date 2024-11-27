import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Product } from '../../models/product';

@Component({
    selector: 'app-product-edit',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">{{title}}</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1" aria-label="Cerrar">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Edit form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="productForm" (ngSubmit)="saveForm()">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input
                        matInput
                        formControlName="nombre"
                        placeholder="Ingrese el nombre del producto"
                        maxlength="100"
                    />
                    <mat-hint align="end">{{productForm.get('nombre')?.value?.length || 0}}/100</mat-hint>
                    <mat-error *ngIf="productForm.get('nombre')?.hasError('required')">
                        El nombre del producto es obligatorio
                    </mat-error>
                    <mat-error *ngIf="productForm.get('nombre')?.hasError('minlength')">
                        El nombre debe tener al menos 3 caracteres
                    </mat-error>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Modelo</mat-label>
                    <input
                        matInput
                        formControlName="modelo"
                        placeholder="Ingrese el modelo del producto"
                        maxlength="50"
                    />
                    <mat-hint align="end">{{productForm.get('modelo')?.value?.length || 0}}/50</mat-hint>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Código</mat-label>
                    <input
                        matInput
                        formControlName="codigo"
                        type="number"
                        placeholder="Ingrese el código del producto"
                        min="0"
                        max="999999"
                    />
                    <mat-error *ngIf="productForm.get('codigo')?.hasError('required')">
                        El código es obligatorio
                    </mat-error>
                    <mat-error *ngIf="productForm.get('codigo')?.hasError('min')">
                        El código debe ser positivo
                    </mat-error>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Precio</mat-label>
                    <input
                        matInput
                        formControlName="precio"
                        type="number"
                        placeholder="Ingrese el precio del producto"
                        min="0"
                    />
                    <mat-error *ngIf="productForm.get('precio')?.hasError('required')">
                        El precio es obligatorio
                    </mat-error>
                    <mat-error *ngIf="productForm.get('precio')?.hasError('min')">
                        El precio debe ser un valor positivo
                    </mat-error>
                </mat-form-field>

                <div class="flex flex-col">
                    <label for="imagen" class="mb-2">Imagen (Máx. 2MB)</label>
                    <input
                        type="file"
                        id="imagen"
                        (change)="onImageSelected($event)"
                        accept="image/*"
                        class="mb-2"
                    />
                    <div class="mt-4" *ngIf="imagePreview">
                        <img [src]="imagePreview" alt="Vista previa del producto" class="max-h-40 rounded" />
                        <button
                            type="button"
                            mat-stroked-button
                            color="warn"
                            class="mt-2"
                            (click)="removeImage()">
                            Eliminar imagen
                        </button>
                    </div>
                    <mat-error *ngIf="imageError" class="mt-2">
                        {{imageError}}
                    </mat-error>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0 ml-auto">
                        <button
                            type="button"
                            mat-stroked-button
                            color="warn"
                            (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            mat-stroked-button
                            color="primary"
                            [disabled]="productForm.invalid">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class ProductEditComponent implements OnInit {
    @Input() title: string = 'Editar Producto';
    @Input() product: Product = {} as Product;

    productForm: FormGroup;
    imagePreview: SafeUrl | null = null;
    imageError: string | null = null;

    private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<ProductEditComponent>,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.initForm();

        if (this.product?.id) {
            this.productForm.patchValue({
                nombre: this.product.nombre,
                modelo: this.product.modelo,
                codigo: this.product.codigo,
                precio: this.product.precio,
                imagen: this.product.imagen,
            });

            if (this.product.imagen) {
                this.imagePreview = this.convertToBase64(this.product.imagen);
            }
        }
    }

    private initForm(): void {
        this.productForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            modelo: [''],
            codigo: [null, [Validators.required, Validators.min(0)]],
            precio: [null, [Validators.required, Validators.min(0)]],
            imagen: [null],
        });
    }

    private convertToBase64(array: Uint8Array): SafeUrl {
        const binary = String.fromCharCode(...array);
        const base64String = `data:image/png;base64,${btoa(binary)}`;
        return this.sanitizer.bypassSecurityTrustUrl(base64String);
    }

    private validateFile(file: File): boolean {
        this.imageError = null;

        if (file.size > this.MAX_FILE_SIZE) {
            this.imageError = 'La imagen no debe superar los 2MB';
            return false;
        }

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            this.imageError = 'Solo se permiten imágenes JPEG o PNG';
            return false;
        }

        return true;
    }

    public onImageSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file && this.validateFile(file)) {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(
                    `data:${file.type};base64,${btoa(
                        String.fromCharCode(...new Uint8Array(arrayBuffer))
                    )}`
                );
                this.productForm.patchValue({
                    imagen: new Uint8Array(arrayBuffer),
                });
            };
            reader.readAsArrayBuffer(file);
        }
    }

    public removeImage(): void {
        this.imagePreview = null;
        this.imageError = null;
        this.productForm.patchValue({
            imagen: null,
        });
    }

    public cancelForm(): void {
        this._matDialog.close();
    }

    public saveForm(): void {
        if (this.productForm.valid) {
            // Llamar al servicio para guardar el producto
            console.log('Formulario Guardado:', this.productForm.value);
            this._matDialog.close(this.productForm.value);
        }
    }
}
