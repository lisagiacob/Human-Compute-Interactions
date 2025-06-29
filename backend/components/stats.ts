/**
 * Represents the array used to returns the stats for a user in a specific time range.
 */
class Stats {
    date: string;
    number_of_b: number;
  
    /**
     * Creates a new instance of the User class.
     * @param date - The date of the stats.
     * @param number_of_b - The number of b for that date.
     */
    constructor(date: string, number_of_b: number) {
      this.date = date;
      this.number_of_b = number_of_b;
    }
  }
  
  export { Stats };