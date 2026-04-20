package com.vinilos.vinilos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disco {
    private Long id;
    private String titulo;
    private String artista;
    private Integer anio;
    private String genero;
    private String imagenUrl;
}