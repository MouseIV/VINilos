package com.vinilos.vinilos.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioUpdateDTO {
    private String ciudad;
    private String telefono;
    private String direccion;
    private String codigoPostal;
    private String apellido;
    private String tipoColeccionista;
}