export interface UserType {
    _id: string;
    name: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date; 
    //  Parent PIN (hashed) amit added this
    parentPinHash?: string | null

    //  Favorites (recipe ids from TheMealDB)
    favoriteRecipeIds?: string[];
}