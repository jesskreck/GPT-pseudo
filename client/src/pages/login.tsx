import { ChangeEvent, FormEvent, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../contexts/AuthContext';

//REVIEW check the following alternatives
// leeren Objekttyp
// type Props = Record<string, never>;
// Objekttyp der beliebige Eigenschaften haben kann
// type Props = object;
// beliebigen Typ
// type Props = unknown;

export default function Login() {

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
    } catch (error) {
      console.log(error)
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  }


  return (

  
    <section className='register'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" placeholder="email" onChange={handleChange} />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" placeholder="password" onChange={handleChange} />
        <button type="submit">Login!</button>
      </form>

      <p>Want to register a new user?</p>
      <a className="a" onClick={navigateToRegister}>Register</a>


      <>{user && navigate('/chat')}</>
      
    </section>

  );
}