package br.unb.pettinder.web.resources;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unb.pettinder.entities.Pet;
import br.unb.pettinder.graph.Graph;
import br.unb.pettinder.services.PetService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/pets")
public class PetResource {


    @Autowired
    private PetService service;


    @GetMapping()
    public List<Pet> getAll(){
		return this.service.getAll();
    }

    @PostMapping()
    public Pet create(@RequestBody Pet pet) {        
        return this.service.create(pet);
    }
    
    
}
