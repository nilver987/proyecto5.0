package com.example.mscatalogo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    @Column(nullable = true)
    private String discripcion;
    private Integer codigo;

}
