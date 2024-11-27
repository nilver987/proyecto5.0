package com.example.msenvio.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoDto {
    private Integer id;
    private String nombre;
    private String marca;
    private BigDecimal precio;
}
