import { User } from '../components/user';
import { db } from '../config/db';

/**
 * Represents a data access object for users.
 */
class UserDAO {

    /**
     * Returns a user by its username.
     */
    async getUserByUsername(username: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            try {
                db.get('SELECT * FROM users WHERE username = ?', [username], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length === 0) {
                            reject(new Error('User not found'));
                        } else {
                            resolve(new User(results.username, results.pfp_id, results.tutorial));
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Creates a new user.
     */
    async createUser(user: User): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            try {
                db.run('INSERT INTO users (username, pfp_id, tutorial) VALUES (?, ?, ?)', [user.username, user.pfp_id, user.tutorial], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new User(user.username, user.pfp_id, user.tutorial));
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Deletes a user by its id.
     */
    async deleteUser(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                db.run('DELETE FROM users WHERE id = ?', [id], (err: Error, results: any) => {
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
     * Returns all the users.
     */
    async getAllUsers(): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            try {
                db.all('SELECT * FROM users', (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const users: User[] = results.map((row: any) => {
                            return new User(row.username, row.pfp_id, row.tutorial);
                        });
                        resolve(users);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Marks the tutorial as completed for a user.
     * @param username - The username of the user.
     */
    async completeTutorial(username: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                db.run('UPDATE users SET tutorial = 1 WHERE username = ?', [username], (err: Error, results: any) => {
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

}

export { UserDAO };