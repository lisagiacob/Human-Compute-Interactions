import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { Product } from '../components/product';
import { ProductController } from '../controllers/productController';
import ErrorHandler from '../helper';


/**
 * Represents a class that defines the routes for handling products.
 */
class ProductRoutes {
    private router: Router;
    private controller: ProductController;
    private errorHandler: ErrorHandler;    

    /**
     * Constructs a new instance of the ProductRoutes class.
     */
    constructor() {
        this.router = express.Router();
        this.controller = new ProductController();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    /**
     * Get the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router;
    }

    /**
     * Initializes the routes for the product router.
     *
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, updating, and deleting product data.
     */
    initRoutes() {
        /**
         * Get all products.
         * @returns A Promise that resolves to an array with all products.
         */
        this.router.get(
            '/',
            (req: any, res: any, next: any) =>
                this.controller
                    .getAllProducts()
                    .then((products: Product[]) => res.status(200).json(products))
                    .catch((err: any) => next(err)),
        );

        /**
         * Get a specific product by ID.
         * @param productId - The ID of the product to retrieve. The product must exist.
         * @returns A Promise that resolves to the product with the specified ID.
         */
        this.router.get('/:productId',
            param('productId').isInt().withMessage('Product ID must be an integer'),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
            try {
                const { productId } = req.params;
                const product = await this.controller.getProductById(productId);

                if (!product) {
                    return res.status(404).send('Invalid product ID');
                }

                res.status(200).json(product);
            } catch (err: any) {
                res.status(404).send(err.message);
            }
        });

        /**
         * Create a new product.
         * @param product - The product data to create.
         * @returns A Promise that resolves to the created product.
         */
        this.router.post(
            '/',
            body('name').isString().withMessage('Name must be a string'),
            body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
            body('duration').isString().withMessage('Duration must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                const product = new Product(
                    req.body.id,
                    req.body.name,
                    req.body.price,
                    req.body.duration
                );
                this.controller
                    .createProduct(product)
                    .then((createdProduct: Product) => res.status(201).json(createdProduct))
                    .catch((err: any) => next(err));
            }
        );

        /**
         * Update a specific product by ID.
         * @param productId - The ID of the product to update. The product must exist.
         * @param product - The updated product data.
         * @returns A Promise that resolves to the updated product.
         */
        this.router.put(
            '/:productId',
            param('productId').isInt().withMessage('Product ID must be an integer'),
            body('name').isString().withMessage('Name must be a string'),
            body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
            body('duration').isString(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
            const product = new Product(
                req.body.id,
                req.body.name,
                req.body.price,
                req.body.duration
            );
            this.controller
                .updateProduct(req.params.productId, product)
                .then((updatedProduct: Product) => res.status(200).json(updatedProduct))
                .catch((err: any) => next(err));
            }
        );

        /**
         * Delete a specific product by ID.
         * @param productId - The ID of the product to delete. The product must exist.
         * @returns A Promise that resolves when the product is deleted.
         */
        this.router.delete(
            '/:productId',
            param('productId').isInt().withMessage('Product ID must be an integer'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .deleteProduct(req.params.productId)
                    .then(() => res.status(200).end())
                    .catch((err: any) => next(err)),
        );
    }
}

export { ProductRoutes };