package com.example.mspedido.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class
ProductoDto {
    private Integer id;
    private String nombre;
    private String marca;
    private BigDecimal precio;
}
