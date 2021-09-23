package com.barrosti.ecommerce.dto;

import com.barrosti.ecommerce.entity.Address;
import com.barrosti.ecommerce.entity.Customer;
import com.barrosti.ecommerce.entity.Order;
import com.barrosti.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
