USE `full-stack-ecommerce`;

-- STEP 1: clean up previous database tables

SET foreign_key_checks = 0;

TRUNCATE customer;
TRUNCATE orders;
TRUNCATE order_item;
TRUNCATE address;

SET foreign_key_checks = 1;

-- STEP 2: make the email address unique
ALTER TABLE customer ADD UNIQUE (email);
