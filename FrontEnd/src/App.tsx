import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const askQuestion = async () => {
    const res = await axios.post('http://localhost:3001/ask', { question });
    setAnswer(res.data.answer);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 ">Resume Q&A Chat</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border p-2"
        placeholder="Ask something related to the resume..."
      />
      <button onClick={askQuestion} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Ask
      </button>
      <div className="mt-4 bg-gray-100 p-3 rounded">
        <strong>Answer:</strong>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default App;
