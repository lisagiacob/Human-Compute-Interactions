import e from 'express';
import { Product } from '../components/product';
import { db } from '../config/db';

/**
 * Represents a data access object for products.
 */
class ProductDAO {

    /**
     * Returns a product by its id.
     */
    async getProductById(id: number): Promise<Product> {
        return new Promise<Product>((resolve, reject) => {
            try {
                db.get('SELECT * FROM products WHERE id = ?', [id], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length === 0) {
                            reject(new Error('Product not found'));
                        } else {
                            resolve(new Product (results.id, results.name, results.price, results.duration));
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Returns a product by its name.
     */
    async getProductByName(name: string): Promise<Product> {
        return new Promise<Product>((resolve, reject) => {
            try {
                db.get('SELECT * FROM products WHERE name = ?', [name], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length === 0) {
                            reject(new Error('Product not found'));
                        } else {
                            resolve(new Product (results.id, results.name, results.price, results.duration));
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Creates a new product.
     */
    async createProduct(product: Product): Promise<Product> {
        return new Promise<Product>((resolve, reject) => {
            try {
                db.run('INSERT INTO products SET ?', product, (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(product);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Deletes a product by its id.
     */
    async deleteProduct(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                db.run('DELETE FROM products WHERE id = ?', [id], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Updates a product.
     */
    async updateProduct(id: number, product: Product): Promise<Product> {
        return new Promise<Product>((resolve, reject) => {
            try {
                db.run('UPDATE products SET name = ?, price = ?, duration = ? WHERE id = ?', [product.name, product.price, product.duration, id], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(product);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Returns all the products.
     */
    async getAllProducts(): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            try {
                db.all('SELECT * FROM products', (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const products: Product[] = results.map((row: any) => new Product(row.ID, row.name, row.price, row.duration));
                        resolve(products);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

export { ProductDAO };