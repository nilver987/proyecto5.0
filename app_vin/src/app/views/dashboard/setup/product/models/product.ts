export class Product {
    id?: number;              // ID del producto
    codigo?: number;          // Código del producto
    modelo?: string;          // Modelo del producto
    nombre?: string;          // Nombre del producto
    imagen?: Uint8Array;      // Imagen almacenada como array de bytes (longblob)
    precio?: number;          // Precio del producto
    category_id?: number;     // ID de la categoría

    // Campo derivado para mostrar la imagen en base64
    get imagenUrl(): string | null {
        if (this.imagen) {
            const binaryString = String.fromCharCode(...this.imagen);
            return `data:image/png;base64,${btoa(binaryString)}`; // Convierte la imagen binaria a base64
        }
        return null;
    }
}

