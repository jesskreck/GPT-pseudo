import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Props = {};
//REVIEW check the following alternatives
// leeren Objekttyp
// type Props = Record<string, never>;
// Objekttyp der beliebige Eigenschaften haben kann
// type Props = object;
// beliebigen Typ
// type Props = unknown;

function Login({ }: Props) {

  //activate navigate hook
  const navigate = useNavigate();
  //active auth hook
  const { login, register } = useAuth();

  //check if there's already a token (=user) in local storage saved
  useEffect(() => {
    const checkForToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Setze den Nutzerzustand in deinem AuthContext oder einer anderen geeigneten Stelle
        // Beispiel: setAuthenticated(true);
      }
    };

    checkForToken();
  }, []);

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
      console.log(error)
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await register(formData.email, formData.password);
      //TODO add confirmation message
      console.log("Registration successful");
    } catch (error) {
      console.log(error);
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
