/**
 * Represents a photo in the system.
 */
class Photo {
    path: string;
    username: string;
    number_of_b: number;
    skincare_id: number | null;
    created_at: Date | null;

    /**
     * Creates a new instance of the Photo class.
     * @param path - The path of the photo.
     * @param username - The username of the user.
     * @param number_of_b - The number of b.
     * @param skincare_id - The skincare_id of the photo.
     * @param created_at - The creation date of the photo.
     */
    constructor(path: string, username: string, number_of_b: number, skincare_id: number | null, created_at: Date | null = null) {
        this.path = path;
        this.username = username;
        this.number_of_b = number_of_b;
        this.skincare_id = skincare_id;
        this.created_at = created_at;
    }
}

export { Photo };