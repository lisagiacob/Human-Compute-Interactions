import { Request, Response } from 'express';
import { ProductDAO } from '../dao/productDAO';
import { Product } from '../components/product';

class ProductController {
    private productDAO: ProductDAO;

    constructor() {
        this.productDAO = new ProductDAO();
    }

    /**
     * Gets a product by ID.
     */
    async getProductById(id: number): Promise<Product> {
        return this.productDAO.getProductById(id);
    }

    /**
     * Gets a product by name.
     */
    async getProductByName(name: string): Promise<Product> {
        return this.productDAO.getProductByName(name);
    }

    /**
     * Creates a new product.
     */
    async createProduct(product: Product): Promise<Product> {
        return this.productDAO.createProduct(product);
    }

    /**
     * Deletes a product by ID.
     */
    async deleteProduct(id: number): Promise<void> {
        return this.productDAO.deleteProduct(id);
    }

    /**
     * Updates a product by ID.
     */
    async updateProduct(id: number, product: Product): Promise<Product> {
        return this.productDAO.updateProduct(id, product);
    }

    /**
     * Gets all products.
     */
    async getAllProducts(): Promise<Product[]> {
        const products = await this.productDAO.getAllProducts();
        return products;
    }
}

export { ProductController };