import { PhotoDAO } from '../dao/photoDAO';
import { Photo } from '../components/photo';
import { SkincareDAO } from '../dao/skincareDAO';


class PhotoController{
    private photoDAO: PhotoDAO;
    private skincareDAO: SkincareDAO;

    constructor() {
        this.photoDAO = new PhotoDAO();
        this.skincareDAO = new SkincareDAO();
    }

    /**
     * Saves a photo.
     */
    async savePhoto(photo: Photo): Promise<Photo> {
        const skincare_id = await this.skincareDAO.getCurrentSkincareID(photo.username);
        photo.skincare_id = skincare_id;

        return this.photoDAO.savePhoto(photo);
    }
    
    /**
     * Gets all photos.
     */
    async getPhotos(): Promise<Photo[]> {
        return this.photoDAO.getAllPhotos();
    }

    /**
     * Gets a photo by id.
     */
    async getPhotoById(id: number): Promise<Photo> {
        return this.photoDAO.getPhotoById(id);
    }

    /**
     * Gets all photos by username.
     */
    async getPhotosByUsername(username: string): Promise<Photo[]> {
        return this.photoDAO.getPhotosByUsername(username);
    }

    /**
     * Deletes a photo by id.
     */
    async deletePhoto(id: number): Promise<void> {
        return this.photoDAO.deletePhoto(id);
    }

    /**
     * Returns the stats for a user in a specific time range.
     */
    async getStatsSingleSkincare(username: string): Promise<any> {
        return this.photoDAO.getStatsSingleSkincare(username);
    }

    /**
     * Returns the mean of the number of b for each skincare of a user.
     */
    async getMeanValue(username: string): Promise<any> {
        return this.photoDAO.getMeanValue(username);
    }
}

export { PhotoController };