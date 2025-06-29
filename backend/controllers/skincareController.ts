import { SkincareDAO } from '../dao/skincareDAO';
import { ProductDAO } from '../dao/productDAO';
import { Skincare } from '../components/skincare';
import { Product } from '../components/product';

class SkincareController {
    private skincareDAO: SkincareDAO;
    private productDAO: ProductDAO;

    constructor() {
        this.skincareDAO = new SkincareDAO();
        this.productDAO = new ProductDAO();
    }

    /**
     * Gets a skincare by id.
     */
    async getSkincareById(skincare_id: number): Promise<Skincare[]> {
        return this.skincareDAO.getSkincare(skincare_id);
    }

   /**
     * Gets the last skincare saved.
     
    async getLastSkincare(): Promise<Skincare> {
        return this.skincareDAO.getLastSkincare();
    } */

    /**
     * Creates a new skincare with three random products.
     */
    async createRandomSkincare(username: string): Promise<void> {
        console.log(`[SkincareController] Richiesta per creare skincare random per ${username}`);
        function getRandomElements<T>(array: T[], count: number): T[] {
            return array.sort(() => 0.5 - Math.random()).slice(0, count);
        }
    
        function getRandomElement<T>(array: T[]): T {
            return array[Math.floor(Math.random() * array.length)];
        }
    
        function getRandomTime(routine: 'morning' | 'afternoon' | 'evening'): string {
            const times = {
                'morning': ['08:00', '09:00', '10:00'],
                'afternoon': ['12:00', '13:00', '14:00'],
                'evening': ['18:00', '19:00', '20:00']
            };
            return getRandomElement(times[routine]);
        }
    
        function getRandomEndTime(startTime: string): string {
            const [hour, minute] = startTime.split(":").map(Number);
            const endHour = hour + 1; // Durata di default 1 ora
            return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }
    
        try {
            // 1️⃣ Recupera i prodotti reali dal database
            const products = await this.productDAO.getAllProducts();
    
            if (products.length === 0) {
                throw new Error("❌ Nessun prodotto disponibile nel database!");
            }
    
            // 2️⃣ Seleziona casualmente 3 prodotti
            const selectedProducts = getRandomElements(products, 3);
    
            // 3️⃣ Crea una nuova skincare
            const skincareProducts: Skincare[] = selectedProducts.map((product: Product) => {
                const routine: 'morning' | 'afternoon' | 'evening' = getRandomElement(['morning', 'afternoon', 'evening']);
                const frequency = getRandomElement(['daily', 'weekly', 'monthly']);
                const startTime = getRandomTime(routine);
                const endTime = getRandomEndTime(startTime);
    
                return new Skincare(product.id, product.name, routine, frequency, startTime, endTime);
            });
    
            console.log(`✅ [SkincareController] Creata nuova skincare random per ${username}:`, skincareProducts);
    
            // 4️⃣ Salva la skincare nel database
            console.log(`[SkincareController] Inviando richiesta al DAO per creare skincare di ${username}`);
            await this.skincareDAO.createSkincare(username, skincareProducts);
    
        } catch (error) {
            console.error("❌ [SkincareController] Errore nella creazione della skincare random:", error);
            throw error;
        }
    }

    /**
     * Creates a new skincare.
     */
    async createSkincare(username: string, skincare_products: Skincare[]): Promise<void> {
        return this.skincareDAO.createSkincare(username, skincare_products);
    }

        /**
     * Creates a new empty skincare.
     */
    async createEmptySkincare(username: string): Promise<void> {
        return this.skincareDAO.createEmptySkincare(username);
    }

    async getCurrentSkincare(username: string): Promise<any> {

        try {
            const skincare = await this.skincareDAO.getCurrentSkincare(username);
            
            if (!skincare) {
                console.log("No skincare found in DB for:", username);
                return null;
            }

           return skincare;
        } catch (error) {
            console.error("Database error:", error);
            throw new Error("Database connection failed");
        }
    }

    async getSkincareByIndex(username: string, index: number): Promise<any> {
        try {
            const skincare = await this.skincareDAO.getSkincareByIndex(username, index);
            if (!skincare) {
                console.log("No skincare found in DB for:", username);
                return null;
            }
            return skincare;
        } catch (error) {
            console.error("Database error:", error);
            throw new Error("Database connection failed");
        }
    }

    /**
     * Per l'aggiunta di un prodotto alla routine
     */
    async addProductToSkincare(username: string, product_id: number, time_of_day: string, frequency: string, start_time: string, end_time: string): Promise<void> {
        try {
            await this.skincareDAO.addProductToSkincare(username, product_id, time_of_day, frequency, start_time, end_time);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Togliere prodotto dalla routine
     */
    async deleteProduct(prodID: number, username: string){
        try {
            console.log("Controller: prodID: " + prodID)
            await this.skincareDAO.deleteProduct(prodID, username);
        } catch (error) {
            console.error("❌ [SkincareController] Error deleting product from skincare:", error);
            throw error;
        }
    }
}

export { SkincareController };