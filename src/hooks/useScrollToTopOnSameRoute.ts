import { useLocation } from "react-router-dom";

const useScrollToTopOnSameRoute = () => {
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return handleNavigation;
};

export default useScrollToTopOnSameRoute;
