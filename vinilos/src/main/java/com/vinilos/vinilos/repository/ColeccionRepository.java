package com.vinilos.vinilos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Usuario;

@Repository
public interface ColeccionRepository extends JpaRepository<Coleccion, Long> {
    
    List<Coleccion> findByUsuario(Usuario usuario);
    
    Optional<Coleccion> findByUsuarioAndViniloIdVinilo(Usuario usuario, Long viniloId);
    
    boolean existsByUsuarioAndViniloIdVinilo(Usuario usuario, Long viniloId);
}