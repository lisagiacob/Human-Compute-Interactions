/**
 * Represents a skincare in the system.
 */
class Skincare {
    product_id: number;
    name: string; 
    time_of_day: string;
    frequency: string;
    start_time: string;
    end_time: string;

    /**
     * Creates a new instance of the skincare class.
     * @param product_id - The product_id of the skincare.
     * @param name - Name of the product
     * @param time_of_day - The time_of_day of the skincare.
     * @param frequency - The frequency of the skincare.
     * @param start_time - The start_time of the skincare.
     * @param end_time - The end_time of the skincare.
     */
    constructor(product_id: number, name:string,  time_of_day: string, frequency: string, start_time: string, end_time: string) {
        this.product_id = product_id;
        this.name = name;
        this.time_of_day = time_of_day;
        this.frequency = frequency;
        this.start_time = start_time;
        this.end_time = end_time;
    }
  }
  
  export { Skincare };