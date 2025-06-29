import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { SkincareController } from '../controllers/skincareController';
import ErrorHandler from '../helper';

/**
 * Represents a class that defines the routes for handling skincare products.
 */
class SkincareRoutes {
    private router: Router;
    private controller: SkincareController;
    private errorHandler: ErrorHandler;

    /**
     * Constructs a new instance of the SkincareRoutes class.
     */
    constructor() {
        this.router = express.Router();
        this.controller = new SkincareController();
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
     * Initializes the routes for the skincare router.
     *
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, and deleting skincare data.
     */
    initRoutes() {
        /**
         * Get a specific skincare product by ID.
         * @param skincare_id - The ID of the skincare product to retrieve. The product must exist.
         * @returns A Promise that resolves to the skincare product with the specified ID.
         */
        this.router.get(
            '/:skincare_id',
            param('skincare_id').isInt().withMessage('Skincare ID must be an integer'),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    const { skincare_id } = req.params;
                    const skincare = await this.controller.getSkincareById(skincare_id);

                    if (!skincare) {
                        return res.status(404).send('Invalid skincare ID');
                    }

                    res.status(200).json(skincare);
                } catch (err: any) {
                    res.status(404).send(err.message);
                }
            }
        );

        /**
         * Create a new skincare product.
         * @param username - The username of the user creating the skincare product.
         * @param skincare_products - The skincare products to create.
         * @returns A Promise that resolves to the created skincare product.
         */
        this.router.post(
            '/',
            body('username').isString().withMessage('Username must be a string'),
            body('skincare_products').isArray().withMessage('Skincare products must be an array'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                const { username, skincare_products } = req.body;

                this.controller
                    .createSkincare(username, skincare_products)
                    .then(() => res.status(201).end())
                    .catch((err: any) => next(err));
            }
        );

        /**
         * Get the current skincare products for a user.
         * @param username - The username of the user.
         * @returns A Promise that resolves to the current skincare products for the user.
         */
        this.router.get(
            '/user/:username',
            param('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .getCurrentSkincare(req.params.username)
                    .then((skincare) => res.status(200).json(skincare))
                    .catch((err) => next(err))
        );

        //const getSkincareByIndex = async (username, index)
        /**
         * Get the previous skincare products for a user.
         * @param username - The username of the user.
         * @param index - The previous skincare is identified as (current_index - index)
         * @returns A Promise that resolves to the current skincare products for the user.
         */
        this.router.get(
            '/index/:username/:index',
            param('username').isString().withMessage('Username must be a string'),
            param('index').isDecimal().withMessage('Index must be a string!'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .getSkincareByIndex(req.params.username, req.params.index)
                    .then((skincare) => res.status(200).json(skincare))
                    .catch((err) => next(err))
        ); 

        /**
         * Create a random skincare routine.
         * @param username - The username of the user.
         * @returns A Promise that resolves to the created skincare routine.
         */
        this.router.post(
            '/random',
            body('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                const { username } = req.body;

                this.controller
                    .createRandomSkincare(username)
                    .then(() => res.status(201).end())
                    .catch((err: any) => next(err));
            }
        );

        /**
         * Adding a product to the skincare
         */
        this.router.post('/add', async (req, res) => {
            try {                
                const {username, product_id, time_of_day, frequency, start_time, end_time } = req.body;
                await this.controller.addProductToSkincare(username, product_id, time_of_day, frequency, start_time, end_time);
                res.status(201).json({ message: "Product added to skincare!" });
            } catch (error) {
                //console.error("Error adding product to skincare:", error);
                res.status(500).json({ error: "Failed to add product to skincare" });
            }
        });

        /**
         * Deleting product from skincare
         */
        this.router.delete('/delete', async (req, res) => {
            try {
                console.log("Dentro alla route");
                const {product_id, username} = req.body;
                await this. controller.deleteProduct(product_id, username);
                res.status(201).json({ message: "Product deleted from skincare!" });
            } catch (error) {
                console.error("Error deleting product from skincare:", error);
                res.status(500).json({ error: "Failed to delete product from skincare" });
            }
        })

        /**
         * Create a random skincare
         */
        this.router.post(
            "/create-random",
            async (req: any, res: any, next: any) => {
                try {
                    const { username } = req.body;
                    console.log("🆕 Creating random skincare for", username);
                    await this.controller.createRandomSkincare(username);
                    res.status(201).json({ message: "Nuova skincare creata!" });
                } catch (error) {
                    console.error("❌ Errore nella creazione della skincare:", error);
                    next(error);
                }
            }
        );

        /**
         * Create an empty skincare
         */
        this.router.post(
            "/create",
            async (req: any, res: any, next: any) => {
                try {
                    const { username } = req.body;
                    console.log("🆕 Creating skincare for", username);
                    await this.controller.createEmptySkincare(username);
                    res.status(201).json({ message: "Nuova skincare creata!" });
                } catch (error) {
                    console.error("❌ Errore nella creazione della skincare:", error);
                    next(error);
                }
            }
        );
    }
}

export { SkincareRoutes };