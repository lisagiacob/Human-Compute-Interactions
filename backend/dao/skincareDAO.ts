import { Skincare } from '../components/skincare';
import { db } from '../config/db';
import { promisify } from 'util';

/**
 * Represents a data access object for users.
 */
class SkincareDAO {
    private dbGet = promisify(db.get).bind(db);
    private dbAll = promisify(db.all).bind(db);

    /**
     * Returns current skincare for a user.
     * @param username - The username of the user.
     * @returns A Promise that resolves to an array of skincare.
     */
    async getCurrentSkincare(username: string): Promise<Skincare[]> {
        try {
            const results: any[] = await new Promise((resolve, reject) => {
                db.all(
                    `SELECT s.ID, s.product_ID, p.name, s.time_of_day, s.frequency, s.start_time, s.end_time 
                     FROM skincares s
                     JOIN user_skincare us ON us.skincare = s.ID
                     JOIN products p ON s.product_ID = p.ID
                     WHERE us.username = ?
                     AND us.skincare = (SELECT MAX(skincare) FROM user_skincare WHERE username = ?)
                     ORDER BY s.start_time`,  
                    [username, username], // 👈 Dobbiamo passare il parametro due volte
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    }
                );
            });
    
            return results.map((row: any) => ({
                product_id: row.product_ID,
                name: row.name || "Unknown",
                time_of_day: row.time_of_day,
                frequency: row.frequency,
                start_time: row.start_time,
                end_time: row.end_time
            }));
    
        } catch (error) {
            console.error("[SkincareDAO] Errore nel recupero della skincare:", error);
            throw error;
        }
    }

    /**
     * Ritorna l'id della skincare corrente
     */
    async getCurrentSkincareID(username: string): Promise<number | null> {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT MAX(skincare) as skincareID FROM user_skincare WHERE username = ?`,
                [username],
                (err, row: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row?.skincareID ?? null); 
                    }
                }
            );
        });
    };

    /**
     * Returns a complete skincare given its id.
     */
    async getSkincare(skincare_id: number): Promise<Skincare[]> {
        return new Promise<Skincare[]>((resolve, reject) => {
            try {
                db.get('SELECT * FROM skincares WHERE id = ?', [skincare_id], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length === 0) {
                            reject(new Error('skincare not found'));
                        } else {
                            results.map((row: any) => {
                                return new Skincare(row.product_id, row.name, row.time_of_day, row.frequency, row.start_time, row.end_time);
                            });
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Recupero gli ID di tutte le skincares dell'utente
     * @param username - username dell'utente loggato
     */
    async getUserSkincareIDs(username: string): Promise<number[]> {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT DISTINCT skincare FROM user_skincare 
                 WHERE username = ? 
                 ORDER BY skincare DESC`,
                [username],
                (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const skincareIDs = rows.map((row: { skincare: number; }) => row.skincare);
                        console.log(skincareIDs);
                        resolve(skincareIDs);
                    }
                }
            );
        });
    }

    /**
     * Trova la skincare current-index
     * @param username 
     * @param index 
     * @returns 
     */
    async getSkincareByIndex(username: string, index: number): Promise<Skincare[]> {
        return new Promise<Skincare[]>(async (resolve, reject) => {  
            try {
                // Recupera tutti gli ID delle skincares dell'utente
                const skincareIDs = await this.getUserSkincareIDs(username);

                if (index >= skincareIDs.length) {
                    reject(new Error("❌ Nessuna skincare trovata per questo indice."));
                    return;
                }

                const skincare_id = skincareIDs[index]; // Prende l'ID corretto dall'elenco
                console.log("INDICE DELLA SKINCARE: " + skincare_id);
    
                db.all(`SELECT s.ID, s.product_ID, p.name, s.time_of_day, s.frequency, s.start_time, s.end_time 
                    FROM skincares s
                    JOIN products p ON s.product_ID = p.ID
                    WHERE s.ID = ?  
                    ORDER BY s.start_time;`, 
                     [skincare_id], (err: Error, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const skincareList = results.map((row: any) => ({
                            product_id: row.product_ID,
                            name: row.name || "Unknown",
                            time_of_day: row.time_of_day,
                            frequency: row.frequency,
                            start_time: row.start_time,
                            end_time: row.end_time
                        }));
                        resolve(skincareList);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    async createEmptySkincare(username: string): Promise<void> {
        console.log(`[SkincareDAO] Creazione di skincare vuota per ${username}`); 

        return new Promise<void>((resolve, reject) => {
            try {
                db.get('SELECT MAX(skincare) as maxSkincare FROM user_skincare WHERE username = ?', [username], (err: Error, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const newSkincare = result.maxSkincare ? result.maxSkincare + 1 : 1;
                        
                        db.run('INSERT INTO user_skincare (username, skincare) VALUES (?, ?)', [username, newSkincare], (err: Error) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            }
            catch (err){
                reject(err);
            }
        });
    }

    /**
     * Creates a new skincare.
     */
    async createSkincare(username: string, skincare_products: Skincare[]): Promise<void> {
        console.log(`[SkincareDAO] Creazione di skincare random per ${username}`);
    
        return new Promise<void>((resolve, reject) => {
            try {
    
                db.get('SELECT MAX(skincare) as maxSkincare FROM user_skincare WHERE username = ?', [username], (err: Error, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        const newSkincare = result.maxSkincare ? result.maxSkincare + 1 : 1;
    
                        db.run('INSERT INTO user_skincare (username, skincare) VALUES (?, ?)', [username, newSkincare], (err: Error) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log("SKIMCARE RANDOM PRODOTTI:", skincare_products);
    
                                // 🚀 Creiamo un array di Promises per gli inserimenti
                                const insertPromises = skincare_products.map((skincare: Skincare) => {
                                    console.log("NOME DEL PRODOTTO", skincare.name);
    
                                    return new Promise<void>((resolveInsert, rejectInsert) => {
                                        db.run(
                                            'INSERT INTO skincares (ID, product_id, time_of_day, frequency, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)',
                                            [newSkincare, skincare.product_id, skincare.time_of_day, skincare.frequency, skincare.start_time, skincare.end_time],
                                            (err: Error) => {
                                                if (err) {
                                                    console.error("[SkincareDAO] Errore nell'inserimento del prodotto:", err);
                                                    rejectInsert(err);
                                                } else {
                                                    console.log(`[SkincareDAO] Prodotto ${skincare.name} inserito nella skincare ${newSkincare}`);
                                                    resolveInsert();
                                                }
                                            }
                                        );
                                    });
                                });
    
                                // ✅ Aspettiamo che tutti gli `INSERT` siano completati prima di risolvere
                                Promise.all(insertPromises)
                                    .then(() => {
                                        console.log("ECCO LA NUOVA SKINCARE:", newSkincare);
                                        resolve();
                                    })
                                    .catch(reject);
                            }
                        });
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    async addProductToSkincare(username: string, product_id: number, time_of_day: string, frequency: string, start_time: string, end_time: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                // 🔍 Trova l'ID della skincare attuale dell'utente
                const skincareID = await this.getCurrentSkincareID(username);
                if (!skincareID) {
                    return reject(new Error("❌ Nessuna skincare trovata per l'utente!"));
                }
    
                console.log(`[SkincareDAO] Adding product to skincare ${skincareID} for user ${username}`);
    
                // 🆕 Aggiungiamo il prodotto alla skincare esistente
                const query = `
                    INSERT INTO skincares (ID, product_ID, time_of_day, frequency, start_time, end_time)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
    
                db.run(query, [skincareID, product_id, time_of_day, frequency, start_time, end_time], function (err) {
                    if (err) {
                        console.error("[SkincareDAO] Error inserting product into skincare:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
    
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteProduct(prodID: number, username: string): Promise<void>{
        return new Promise(async (resolve, reject) => {
            try {
                const skincareID = await this.getCurrentSkincareID(username);
                if (!skincareID) {
                    return reject(new Error("❌ Nessuna skincare trovata per l'utente!"));
                }
                const query = `
                DELETE FROM skincares WHERE product_ID = ? AND ID = ?
                `;

                db.run(query, [prodID, skincareID], function (err) {
                    if (err) {
                        console.error("[SkincareDAO] Error inserting product into skincare:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
            catch(error){
                reject(error);
            }
        });
    }
    
}
export { SkincareDAO };