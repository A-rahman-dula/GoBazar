import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api'; // Ensure you have an API instance configured with Axios

const NavBarLink = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('get_username/') // Make sure the API endpoint is correct
        .then((response) => {
          setUsername(response.data.username); // Assuming API returns { "username": "Clinton" }
        })
        .catch((error) => {
          console.error('Error fetching username:', error);
        });
    }
  }, [isAuthenticated]);

  return (
    <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
      <li className='nav-item'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            isActive ? 'nav-link active fw-semibold' : 'nav-link fw-semibold'
          }
          end
        >
          Home
        </NavLink>
      </li>

      <li className='nav-item'>
        <NavLink
          to='/about'
          className={({ isActive }) =>
            isActive ? 'nav-link active fw-semibold' : 'nav-link fw-semibold'
          }
          end
        >
          About
        </NavLink>
      </li>
      <li className='nav-item'>
        <NavLink
          to='/contactus'
          className={({ isActive }) =>
            isActive ? 'nav-link active fw-semibold' : 'nav-link fw-semibold'
          }
          end
        >
          Contact
        </NavLink>
      </li>
      {isAuthenticated ? (
        <>
          <li className='nav-item'>
            <NavLink
              to='/profile'
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active fw-semibold'
                  : 'nav-link fw-semibold'
              }
              end
            >
              Hi, {username || 'User'} {/* Fallback if username is empty */}
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/logout'
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active fw-semibold'
                  : 'nav-link fw-semibold'
              }
              end
            >
              Logout
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li className='nav-item'>
            <NavLink
              to='/login'
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active fw-semibold'
                  : 'nav-link fw-semibold'
              }
              end
            >
              Login
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/register'
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active fw-semibold'
                  : 'nav-link fw-semibold'
              }
              end
            >
              Register
            </NavLink>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavBarLink;
