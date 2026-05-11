package com.vinilos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vinilos.vinilos.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByEmail(String email);
}
