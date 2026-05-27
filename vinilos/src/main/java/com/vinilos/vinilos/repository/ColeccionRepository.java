package com.vinilos.vinilos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Usuario;

public interface ColeccionRepository extends JpaRepository<Coleccion, Long> {
    
    List<Coleccion> findByUsuario(Usuario usuario);
    
    Optional<Coleccion> findByUsuarioAndDiscoId(Usuario usuario, Long discoId);
    
    boolean existsByUsuarioAndDiscoId(Usuario usuario, Long discoId);
}
