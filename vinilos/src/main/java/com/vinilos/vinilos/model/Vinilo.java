package com.vinilos.vinilos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vinilos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vinilo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vinilo")
    private Long idVinilo;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, length = 150)
    private String artista;

    @Column(length = 100)
    private String genero;

    @Column(name = "fecha_lanzamiento")
    private java.sql.Date fechaLanzamiento;

    @Column(name = "api_source_id", length = 100)
    private String apiSourceId;
    
    // Campos adicionales para el frontend
    private Integer anio;
    
    private String imagenUrl;
    
    private String discogsId;
}