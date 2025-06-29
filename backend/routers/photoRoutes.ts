import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { PhotoController } from '../controllers/photoController';
import ErrorHandler from '../helper';
import { Photo } from '../components/photo';

/**
 * Represents a class that defines the routes for handling photos.
 */
class PhotoRoutes {
    private router: Router;
    private controller: PhotoController;
    private errorHandler: ErrorHandler;

    /**
     * Constructs a new instance of the PhotoRoutes class.
     */
    constructor() {
        this.router = express.Router();
        this.controller = new PhotoController();
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
     * Initializes the routes for the photo router.
     *
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, updating, and deleting photo data.
     */
    initRoutes() {
        /**
         * Get all photos.
         * @returns A Promise that resolves to an array with all photos.
         */
        this.router.get(
            '/',
            (req: any, res: any, next: any) =>
                this.controller
                    .getPhotos()
                    .then((photos) => res.status(200).json(photos))
                    .catch((err) => next(err)),
        );

        /**
         * Get a specific photo by ID.
         * @param photoId - The ID of the photo to retrieve. The photo must exist.
         * @returns A Promise that resolves to the photo with the specified ID.
         */
        this.router.get(
            '/:photoId',
            param('photoId').isInt().withMessage('Photo ID must be an integer'),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    const { photoId } = req.params;
                    const photo = await this.controller.getPhotoById(photoId);

                    if (!photo) {
                        return res.status(404).send('Invalid photo ID');
                    }

                    res.status(200).json(photo);
                } catch (err: any) {
                    res.status(404).send(err.message);
                }
            },
        );

        /**
         * Get all photos by username.
         * @param username - The username to filter photos by.
         * @returns A Promise that resolves to an array of photos by the specified username.
         */
        this.router.get(
            '/user/:username',
            param('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .getPhotosByUsername(req.params.username)
                    .then((photos) => res.status(200).json(photos))
                    .catch((err) => next(err)),
        );

        /**
         * Delete a specific photo by ID.
         * @param photoId - The ID of the photo to delete. The photo must exist.
         * @returns A Promise that resolves when the photo is deleted.
         */
        this.router.delete(
            '/:photoId',
            param('photoId').isInt().withMessage('Photo ID must be an integer'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .deletePhoto(req.params.photoId)
                    .then(() => res.status(200).end())
                    .catch((err) => next(err)),
        );

        /**
         * Create a new photo.
         * @param path - The path of the photo.
         * @param username - The username of the user.
         * @param number_of_b - The number of b.
         * @param skincare_id - The skincare_id of the photo.
         * @param created_at - The creation date of the photo.
         * @returns A Promise that resolves to the created photo.
         */
        this.router.post(
            '/',
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                const photo = new Photo(req.body.path, req.body.username, Math.floor(Math.random() * 7), null, null);
                this.controller
                    .savePhoto(photo)
                    .then((savedPhoto) => res.status(201).json(savedPhoto))
                    .catch((err) => next(err));
            },
        );
        
        /**
         * Get the stats for a user during a specific skincare.
         * @param username - The username of the user.
         * @returns A Promise that resolves to an array of object with the date and the number of b for that date.
         */
        this.router.get(
            '/stats/:username',
            param('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .getStatsSingleSkincare(req.params.username)
                    .then((stats) => res.status(200).json(stats))
                    .catch((err) => next(err)),
        );


        /**
         * Get the mean of the number of b for each skincare of a user.
         * @param username - The username of the user.
         * @returns A Promise that resolves to an array of object with the skincare_id and the mean of the number of b for that skincare.
         */
        this.router.get(
            '/mean/:username',
            param('username').isString().withMessage('Username must be a string'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) =>
                this.controller
                    .getMeanValue(req.params.username)
                    .then((mean) => res.status(200).json(mean))
                    .catch((err) => next(err)),
        );
    }
}

export { PhotoRoutes };