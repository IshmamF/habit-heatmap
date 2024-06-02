import { auth } from '../firebase';

export const isAuthenticated = () => {
    return auth.currentUser != null;
};
