package com.vinilos.vinilos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "discos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disco {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String artista;
    
    private Integer anio;
    
    private String genero;
    
    private String imagenUrl;
    
    @Column(unique = true)
    private String discogsId;  // ← NUEVO: ID de Discogs para evitar duplicados
}