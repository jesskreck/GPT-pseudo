import React, { ChangeEvent, FormEvent, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../contexts/AuthContext';

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
  // const { login, register } = useAuth();
  const { login, register } = useContext(AuthContext);
  // q: Why does it say that login doesnt exist on type AuthContextType?
  // a: Because the AuthContextType interface does not include the login function
  // q: It does - in AuthContext.tsx line 17
  // a: Yes, but the AuthContextType interface is not the same as the AuthContext

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
    <section className='login'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" name="email" placeholder="email" onChange={handleChange} />
        <input type="password" name="password" placeholder="password" onChange={handleChange} />
        <button type="submit">Login!</button>
      </form>

    </section>
  );
}

export default Login;
