package com.barrosti.ecommerce.config;


import com.barrosti.ecommerce.dao.AuthorRepository;
import com.barrosti.ecommerce.dao.ProductCategoryRepository;
import com.barrosti.ecommerce.dao.ProductRepository;
import com.barrosti.ecommerce.entity.Author;
import com.barrosti.ecommerce.entity.Product;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StartupTest implements ApplicationListener<ContextRefreshedEvent> {

    private final AuthorRepository authorRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductRepository productRepository;

    public StartupTest(AuthorRepository authorRepository, ProductCategoryRepository productCategoryRepository, ProductRepository productRepository) {
        this.authorRepository = authorRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    //@Transactional
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        Optional<Author> author1Op = authorRepository.findById(1L);
        if(author1Op.isPresent()){
            System.out.println("Present");
            Author author1 = author1Op.get();
            System.out.println("firstName: " + author1.getFirstName());
            System.out.println("lastName: " + author1.getLastName());

            if( author1.getBooks() != null && !author1.getBooks().isEmpty() ){
                System.out.println("books: " + author1.getBooks().size());;

                for (Product book : author1.getBooks()){
                    System.out.println( "Author1/books: " + book.getDescription() );
                }
            }


        }else{
            System.out.println("Not Present");
        }
    }
}
