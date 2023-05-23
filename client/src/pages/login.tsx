import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';


type Props = {};
//REVIEW check the following alternatives
// leeren Objekttyp
// type Props = Record<string, never>;
// Objekttyp der beliebige Eigenschaften haben kann
// type Props = object;
// beliebigen Typ
// type Props = unknown;


type SubmitLoginData = {
  email: string;
  password: string;
};

function Login({ }: Props) {

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


  const [formData, setFormData] = useState<SubmitLoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        // Speichere den Token im Local Storage
        localStorage.setItem('token', token);

        // Setze den Nutzerzustand in deinem AuthContext oder einer anderen geeigneten Stelle
        // Beispiel: setAuthenticated(true);

        // Weiterleitung zur nächsten Seite oder Ausführung anderer logischer Schritte
        // Beispiel: history.push('/dashboard');
      } else {
        // Handhabe Fehler bei der Authentifizierung
        // Beispiel: setError('Invalid credentials');
      }
    } catch (error) {
      // Handhabe allgemeine Fehler
      console.log(error);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      
      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        localStorage.setItem('token', token);
      }

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
