import React, { useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const response = await fetch('http://192.168.1.130:5000/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
    <div>
      <h1>Form Submission</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Enter your name" />
        <button type="submit">Submit</button>
      </form>

      {data && (
        <div>
          <h2>Response</h2>
          <p>{data.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;