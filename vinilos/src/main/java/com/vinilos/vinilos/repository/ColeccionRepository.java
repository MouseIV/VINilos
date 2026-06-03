package com.vinilos.vinilos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vinilos.vinilos.model.Coleccion;
import com.vinilos.vinilos.model.Usuario;

@Repository
public interface ColeccionRepository extends JpaRepository<Coleccion, Long> {
    
    List<Coleccion> findByUsuario(Usuario usuario);
    
    @Query("SELECT c FROM Coleccion c WHERE c.usuario = :usuario AND c.vinilo.idVinilo = :viniloId")
    Optional<Coleccion> findByUsuarioAndViniloId(@Param("usuario") Usuario usuario, @Param("viniloId") Long viniloId);
    
    @Query("SELECT COUNT(c) > 0 FROM Coleccion c WHERE c.usuario = :usuario AND c.vinilo.idVinilo = :viniloId")
    boolean existsByUsuarioAndViniloId(@Param("usuario") Usuario usuario, @Param("viniloId") Long viniloId);
}