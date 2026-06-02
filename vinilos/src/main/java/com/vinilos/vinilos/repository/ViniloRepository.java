package com.vinilos.vinilos.repository;

import com.vinilos.vinilos.model.Vinilo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ViniloRepository extends JpaRepository<Vinilo, Long> {
    Optional<Vinilo> findByDiscogsId(String discogsId);
    Optional<Vinilo> findByApiSourceId(String apiSourceId);
}