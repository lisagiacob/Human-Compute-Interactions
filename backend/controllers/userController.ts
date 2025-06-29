import { UserDAO } from '../dao/userDAO';
import { User } from '../components/user';

class UserController {
    private userDAO: UserDAO;

    constructor() {
        this.userDAO = new UserDAO();
    }
    /**
     * Gets a user by username.
     */
    async getUserByUsername(username: string): Promise<User> {
        return this.userDAO.getUserByUsername(username);
    }

    /**
     * Creates a new user.
     */
    async createUser(user: User): Promise<User> {
        return this.userDAO.createUser(user);
    }

    /**
     * Deletes a user by id.
     */
    async deleteUser(id: number): Promise<void> {
        return this.userDAO.deleteUser(id);
    }

    /**
     * Gets all users.
     */
    async getAllUsers(): Promise<User[]> {
        return this.userDAO.getAllUsers();
    }

    /**
     * Marks the tutorial as completed for a user.
     */
    async completeTutorial(username: string): Promise<void> {
        return this.userDAO.completeTutorial(username);
    }
}

export { UserController };