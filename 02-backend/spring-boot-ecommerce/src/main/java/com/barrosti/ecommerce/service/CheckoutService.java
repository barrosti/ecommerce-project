package com.barrosti.ecommerce.service;

import com.barrosti.ecommerce.dto.Purchase;
import com.barrosti.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
