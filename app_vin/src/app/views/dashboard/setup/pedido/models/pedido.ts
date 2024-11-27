  // Importamos la interfaz PedidoDetalle

export interface Pedido {
    id: number;
    descripcion: string;
    numero: string;
    serie: string;
    cliente_id: number;

}

export interface PedidoDetalle {
    id: number;
    producto: string;
    cantidad: number;
    precio: number;
    total: number;
    pedidoId: number;  // Relacionado al ID del Pedido
}

