import { useState } from 'react';
import axios from 'axios';
import { AuroraBackground } from "./components/ui/aurora-background";
import { ContainerTextFlip } from "./components/ui/container-text-flip";

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');

    try {
      // const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/ask`, { question });
      // const res = await axios.post(`http://localhost:3001/ask`, { question });
      const res = await axios.post(`https://mysol-backend.onrender.com/ask`, { question });

      setAnswer(res.data.answer);
    } catch (error) {
      console.error("API Error:", error);
      setAnswer("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="absolute inset-0 -z-10">
        <AuroraBackground children={undefined} />
      </div>

      <h1 className="flex justify-center text-5xl items-center font-bold mb-20 mt-25 text-white dark:text-white  sm:text-white md:text-black lg:text-black">
        Talk to{" "}
        <ContainerTextFlip
          words={["MySol", "Danish", "MY AI"]}
          interval={5000}
          className="text-center text-5xl font-bold text-black md:text-7xl dark:text-white"
        />
      </h1>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border p-2 bg-white md:bg-transparent lg:bg-transparent 2xl:bg-transparent"
        placeholder="Ask something related to the resume..."
      />

      <button
        onClick={askQuestion}
        className={`p-[3px] relative mt-4 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
          {loading ? "Loading..." : "Ask Anything"}
        </div>
      </button>

      <div className="mt-4 bg-gray-100 p-3 rounded">
        <strong>Answer:</strong>
        {loading ? (
          <div className="mt-2">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        ) : (
          <p>{answer}</p>
        )}
      </div>
    </div>
  );
}

export default App;
