/**
 * Represents a user in the system.
 */
class User {
    username: string;
    pfp_id: number | null;
    tutorial: boolean;
  
    /**
     * Creates a new instance of the User class.
     * @param username - The username of the user. This is unique for each user.
     * @param pfp_id - The ID of the user's profile picture.
     * @param tutorial - Whether the user has completed the tutorial.
     */
    constructor(username: string, pfp_id: number | null = null, tutorial: boolean = false) {
      this.username = username;
      this.pfp_id = pfp_id;
      this.tutorial = tutorial;
    }
  }
  
  export { User };