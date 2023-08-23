package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long id);
}
