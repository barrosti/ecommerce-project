package com.barrosti.ecommerce.dao;

import com.barrosti.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Set;

@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Long> {

    Set<State> findByCountryCode(@Param("code") String code);
}
