package com.barrosti.ecommerce.dao;

import com.barrosti.ecommerce.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface AuthorRepository extends JpaRepository<Author, Long> {

    Page<Author> findById(@RequestParam("id") Long id, Pageable pageable);
}
