import express from 'express';
import ErrorHandler from './helper';
import { UserRoutes } from './routers/userRoutes';
import { ProductRoutes } from './routers/productRoutes';
import { PhotoRoutes } from './routers/photoRoutes';
import { SkincareRoutes } from './routers/skincareRoutes';

const morgan = require('morgan');
const prefix = '/brupholee/api';

/**
 * Initializes the routes for the application.
 *
 * @remarks
 * This function sets up the routes for the application.
 * It defines the routes for the user, authentication, product, and cart resources.
 *
 * @param {express.Application} app - The express application instance.
 */
function initRoutes(app: express.Application) {
  app.use(morgan('dev')); // Log requests to the console
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ limit: '25mb', extended: true }));

  /**
   * The authenticator object is used to authenticate users.
   * It is used to protect the routes by requiring users to be logged in.
   * It is also used to protect routes by requiring users to have the correct role.
   */
  const userRoutes = new UserRoutes();
  const productRoutes = new ProductRoutes();
  const photoRoutes = new PhotoRoutes();
  const skincareRoutes = new SkincareRoutes();

  /**
   * The routes for the user, authentication, product, proposal, and cart resources are defined here.
   */
  app.use(`${prefix}/users`, userRoutes.getRouter());
  app.use(`${prefix}/products`, productRoutes.getRouter());
  app.use(`${prefix}/photos`, photoRoutes.getRouter());
  app.use(`${prefix}/skincare`, skincareRoutes.getRouter());

  ErrorHandler.registerErrorHandler(app);

}

export default initRoutes;

