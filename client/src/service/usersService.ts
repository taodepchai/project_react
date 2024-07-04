import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../interface/types';

const useFetchUsers = () => {
  const [Users, setUsers] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/account');
        console.log(response);
        // setUsers(response.users);
        setLoading(false);
      } catch (error) {
        setError('Error fetching Users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { Users, loading, error };
};

export default useFetchUsers;
