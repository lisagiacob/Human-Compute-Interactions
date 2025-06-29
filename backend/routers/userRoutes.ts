import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '../controllers/userController';
import ErrorHandler from '../helper';
import { User } from '../components/user';

/**
 * Represents a class that defines the routes for handling users.
 */
class UserRoutes {
    private router: Router;
    private controller: UserController;
    private errorHandler: ErrorHandler;

    /**
     * Constructs a new instance of the UserRoutes class.
     */
    constructor() {
        this.router = express.Router();
        this.controller = new UserController();
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
     * Initializes the routes for the user router.
     *
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, and deleting user data.
     */
    initRoutes() {
        /**
         * Get a specific user by username.
         * @param username - The username of the user to retrieve. The user must exist.
         * @returns A Promise that resolves to the user with the specified username.
         */
        this.router.get(
            '/:username',
            param('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    const { username } = req.params;
                    const user = await this.controller.getUserByUsername(username);

                    if (!user) {
                        return res.status(404).send('Invalid username');
                    }

                    res.status(200).json(user);
                } catch (err: any) {
                    res.status(404).send(err.message);
                }
            }
        );

        /**
         * Create a new user.
         * @param user - The user data to create.
         * @returns A Promise that resolves to the created user.
         */
        this.router.post(
            '/',
            body('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                const user = new User(req.body.username, req.body.pfp_id, req.body.tutorial);

            this.controller
                .createUser(user)
                .then((createdUser: any) => res.status(201).json(createdUser))
                .catch((err: any) => next(err));
            },
        );

        /**
         * Delete a specific user by ID.
         * @param userId - The ID of the user to delete. The user must exist.
         * @returns A Promise that resolves when the user is deleted.
         */
        this.router.delete(
            '/:username',
            param('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .deleteUser(req.params.userId)
                    .then(() => res.status(200).end())
                    .catch((err: any) => next(err)),
        );

        /**
         * Get all users.
         * @returns A Promise that resolves to an array with all users.
         */
        this.router.get(
            '/',
            (req: any, res: any, next: any) =>
                this.controller
                    .getAllUsers()
                    .then((users: any) => res.status(200).json(users))
                    .catch((err: any) => next(err)),
        );

        /**
         * Mark the tutorial as completed for a user.
         * @param username - The username of the user to mark the tutorial as completed.
         * @returns A Promise that resolves when the tutorial is marked as completed.
         */
        this.router.put(
            '/tutorial/:username',
            param('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                this.controller
                    .completeTutorial(req.params.username)
                    .then(() => {
                        res.status(200).json({ message: 'Tutorial completed successfully' });
                    })
                    .catch((err: any) => {
                        console.error('Error completing tutorial:', err);
                        next(err);
                    });
            }
        );
    }
}

export { UserRoutes };