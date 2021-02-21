package br.unb.pettinder.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.unb.pettinder.entities.Pet;
import br.unb.pettinder.graph.Graph;
import br.unb.pettinder.repositories.PetRepository;

@Service
public class PetService {

    private final PetRepository repository;

    public PetService(PetRepository repository) {
        this.repository = repository;
    }

    public List<Pet> getAll() {
        List<Pet> pets = this.repository.findAll();

        Graph<Pet> graph = new Graph<Pet>();
        for (Pet p : pets) {
            Pet parent = null;
            // System.out.println(graph);

            if (p.getParentId() == null || p.getParentId() == 0) {
                graph.addEdge(p, p, false);
            } else {
                parent = pets.stream().filter(item -> item.getId() == p.getParentId()).findFirst().get();
                graph.addEdge(parent, p, false);
            }
        }

        System.out.println(graph);

        pets = graph.getMap().keySet().stream().sorted().collect(Collectors.toList());
        return pets;
    }

    public Pet create(Pet pet) {
        if(pet.getId() !=null){
            Optional<Pet> opt = this.repository.findById(pet.getId());
            if(opt.isPresent()){
                pet = this.repository.save(pet);
                return pet;
            }
        }
        pet.setId(null);
        pet = this.repository.save(pet);
        return pet;
    }
}
