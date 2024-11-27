export class Product {
    id?: number;              // ID del producto
    codigo?: number;          // Código del producto
    modelo?: string;          // Modelo del producto
    nombre?: string;          // Nombre del producto
    imagen?: Uint8Array;      // Imagen almacenada como array de bytes (longblob)
    precio?: number;          // Precio del producto

    // Campo derivado para mostrar la imagen en base64
    get imagenUrl(): string | null {
        return this.imagen
            ? `data:image/png;base64,${btoa(
                new Uint8Array(this.imagen).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            )}` // Convierte la imagen binaria a base64
            : null;
    }
}
