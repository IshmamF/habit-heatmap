import { useLocation } from 'react-router-dom';

const useShowNavbar = () => {
    const location = useLocation();
    return location.pathname !== '/login';
};

export default useShowNavbar;