package br.unb.pettinder.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import br.unb.pettinder.entities.Pet;

@Repository
public interface PetRepository extends JpaRepository<Pet,Long>{
    
}
