import e from "express";

/**
 * Represents a skincare product in the system.
 */
class Product {
    id: number;
    name: string;
    price: number;
    duration: number;
    /**
     * Creates a new instance of the Product class.
     * @param id
     * @param name - The name of the product.
     * @param price - The price of the product.
     * @param duration - The duration of the product.
     */

    constructor(id: number, name: string, price: number, duration: number){
        this.id = id;
        this.name = name;
        this.price = price;
        this.duration = duration;
    }
}

export { Product };