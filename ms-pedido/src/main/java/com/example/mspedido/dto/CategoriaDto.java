package com.example.mspedido.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class CategoriaDto {
   private Integer id;
   private String nombre;
   @Column(nullable = true)
   private String discripcion;
   private Integer codigo;
}
