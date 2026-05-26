package com.vinilos.vinilos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Campos que ya tenías
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String username;

    private String rol = "USUARIO";

    // -------------------------
    // CAMPOS NUEVOS (NO OBLIGATORIOS)
    // -------------------------

    @Column(nullable = true, length = 150)
    private String apellido;

    @Column(nullable = true, length = 50)
    private String ciudad;

    @Column(nullable = true, length = 200)
    private String direccion;

    @Column(nullable = true, length = 10)
    private String codigoPostal;

    @Column(nullable = true)
    private String fechaRegistro;

    @Column(nullable = true)
    private String tipoCliente;

    @Column(nullable = true)
    private Integer valoracionVendedor;
}
