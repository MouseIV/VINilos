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
    @JoinColumn(name = "id_vinilo", nullable = false)
    private Vinilo vinilo;
    
    private LocalDateTime fechaAdquisicion;
    
    private String estado;
    
    private Integer calificacion;
    
    public Coleccion(Usuario usuario, Vinilo vinilo) {
        this.usuario = usuario;
        this.vinilo = vinilo;
        this.fechaAdquisicion = LocalDateTime.now();
        this.estado = "NUEVO";
        this.calificacion = 5;
    }
}