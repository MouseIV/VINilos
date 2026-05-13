package com.vinilos.vinilos.repository;

import com.vinilos.vinilos.model.Disco;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DiscoRepository extends JpaRepository<Disco, Long> {
    Optional<Disco> findByDiscogsId(String discogsId);
}