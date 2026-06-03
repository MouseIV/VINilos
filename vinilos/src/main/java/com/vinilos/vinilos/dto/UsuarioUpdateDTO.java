package com.vinilos.vinilos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioUpdateDTO {
    private String ciudad;
    private String telefono;
    private String direccion;
    private String codigoPostal;
    private String apellido;
    private String prefijo;
    private String tipoColeccionista;
}