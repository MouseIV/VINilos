package com.vinilos.vinilos.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "colecciones")
@Data
@NoArgsConstructor
public class Coleccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "disco_id", nullable = false)
    private Disco disco;
    
    private LocalDateTime fechaAdquisicion;
    
    private String estado; // NUEVO, MUY_BUENO, BUENO, REGULAR
    
    private Integer calificacion; // 1 a 5
    
    public Coleccion(Usuario usuario, Disco disco) {
        this.usuario = usuario;
        this.disco = disco;
        this.fechaAdquisicion = LocalDateTime.now();
        this.estado = "NUEVO";
        this.calificacion = 5;
    }
}