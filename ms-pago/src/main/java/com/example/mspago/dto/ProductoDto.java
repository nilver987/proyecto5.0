package com.example.mspago.dto;

import lombok.Data; // Importa la anotación de Lombok para generar automáticamente getters y setters

import java.math.BigDecimal;

@Data // Genera automáticamente los métodos getters, setters, toString, equals y hashCode
public class ProductoDto {
    private Integer id;
    private String nombre;
    private String marca;
    private BigDecimal precio;
}
