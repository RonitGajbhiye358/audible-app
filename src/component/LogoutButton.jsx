// src/components/LogoutButton.jsx
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../app/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className=" bg-red-500 cursor-pointer md:ml-8 rounded-xl ">
      <button
        onClick={handleLogout}
        title="Log Out"
        className=" group flex justify-center items-center font-semibold gap-0 md:gap-4 p-3 md:px-4 md:py-2 text-white rounded-md text-lg h-11  text-center group-hover:text-black "
      >
        <img
          src="/Logout.png"
          alt="Logout"
          className="invert w-7 h-7 group-hover:invert-0"
        />
        <div className="collapse md:visible w-0 md:w-auto group-hover:invert">Log Out</div>
      </button>
    </div>
  );
};

export default LogoutButton;