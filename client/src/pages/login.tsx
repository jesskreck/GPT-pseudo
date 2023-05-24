import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Props = {};

function Login({}: Props) {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Record<K, V> is a utility type that represents an object type with keys of type K and values of type V
  // in this case: formData has string keys and string values
  const [formData, setFormData] = useState<Record<string, string>>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      navigate('/chat');
    } catch (error) {
      // Handle login error
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Register logic
    } catch (error) {
      // Handle registration error
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="email" onChange={handleChange} />
        <input type="password" name="password" placeholder="password" onChange={handleChange} />
        <button type="submit">Login!</button>
      </form>

      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input type="email" name="email" placeholder="email" onChange={handleChange} />
        <input type="password" name="password" placeholder="password" onChange={handleChange} />
        <button type="submit">Register!</button>
      </form>
    </div>
  );
}

export default Login;
