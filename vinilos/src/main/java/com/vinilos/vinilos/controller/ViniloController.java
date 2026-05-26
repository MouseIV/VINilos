package com.vinilos.vinilos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinilos.vinilos.model.Vinilo;
import com.vinilos.vinilos.repository.ViniloRepository;

@RestController
@RequestMapping("/vinilos")
@CrossOrigin(origins = "*") // Permite que tu frontend acceda sin CORS
public class ViniloController {

    @Autowired
    private ViniloRepository viniloRepository;

    @GetMapping
    public List<Vinilo> getAllVinilos() {
        return viniloRepository.findAll();
    }
}
