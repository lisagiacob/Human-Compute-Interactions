import { Photo } from '../components/photo';
import { Stats } from '../components/stats';
import { db } from '../config/db';

/**
 * Represents a data access object for photos.
 */
class PhotoDAO {

    /**
     * Saves a photo.
     */
    async savePhoto(photo: Photo): Promise<Photo> {
        return new Promise<Photo>((resolve, reject) => {
            try {
                db.run('INSERT INTO photos (number_of_b, skincare_ID, username, path, created_at) VALUES (?, ?, ?, ?, ?)',
                     [photo.number_of_b, photo.skincare_id, photo.username, photo.path, new Date().toISOString()], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(photo);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Returns all photos.
     */
    async getAllPhotos(): Promise<Photo[]> {
        return new Promise<Photo[]>((resolve, reject) => {
            try {
                db.all('SELECT * FROM photos', (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const photos: Photo[] = results.map((row: any) => {
                            return new Photo(row.path, row.username, row.number_of_b, row.skincare_ID, row.created_at);
                        });
                        resolve(photos);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Returns a photo by its id.
     */
    async getPhotoById(id: number): Promise<Photo> {
        return new Promise<Photo>((resolve, reject) => {
            try {
                db.get('SELECT * FROM photos WHERE ID = ?', [id], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length === 0) {
                            reject(new Error('Photo not found'));
                        } else {
                            resolve(new Photo(results.path, results.username, results.number_of_b, results.skincare_ID, results.created_at));
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Returns all the photos of a user.
     */
    async getPhotosByUsername(username: string): Promise<Photo[]> {
        return new Promise<Photo[]>((resolve, reject) => {
            try {
                db.all('SELECT * FROM photos WHERE username = ?', [username], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const photos: Photo[] = results.map((row: any) => {
                            return new Photo(row.path, row.username, row.number_of_b, row.skincare_ID, row.created_at);
                        });
                        resolve(photos);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Deletes a photo by its id.
     */
    async deletePhoto(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                db.run('DELETE FROM photos WHERE id = ?', [id], (err: Error, results: any) => {
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
     * Returns the stats for a user in a specific time range.
     * @param username - The username of the user.
     * @returns an array of object with the date and the number of b for that date.
     */
    async getStatsSingleSkincare(username: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            try {
                // First, get the maximum skincare ID for the given username
                db.get('SELECT MAX(skincare_ID) as maxSkincareID FROM photos WHERE username = ?', [username], (err: Error, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const maxSkincareID = result.maxSkincareID;
                        if (maxSkincareID) {
                            // Then, get the stats for the maximum skincare ID
                            db.all(`SELECT created_at, number_of_b 
                                    FROM photos 
                                    WHERE username = ? AND skincare_ID = ?`,
                                [username, maxSkincareID], (err: Error, results: any) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const stats: any[] = results.map((row: any) => {
                                        return new Stats(row.created_at, row.number_of_b);
                                    });
                                    resolve(stats);
                                }
                            });
                        } else {
                            resolve([]); // No skincare records found for the user
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Returns the mean value for each skincare of a user.
     * @param username - The username of the user.
     * @returns an array of object with the skincare id and the mean value of b for that skincare.
     */
    async getMeanValue(username: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            try {
                db.all(`SELECT skincare_ID, ROUND(AVG(number_of_b), 1) as mean_value
                    FROM photos
                    WHERE username = ? AND skincare_id IS NOT NULL
                    GROUP BY skincare_ID`, [username], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }


}

export { PhotoDAO };