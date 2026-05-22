// components/DiagnosticQuiz.tsx
// Updated quiz questions with Lexio DNA for MVP - path to full Cartografa

'use client';
import { useState } from 'react';

export function DiagnosticQuiz() {
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [interest, setInterest] = useState(''); // Memory palace hook for lesson generation
  const [submitted, setSubmitted] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // Updated questions with explicit Lexio DNA:
  // 1. Grammar: Acceptability judgments + self-explanation (why it sounds strange)
  // 2. Logic: Map of Ignorance - revisiting "known" ideas to check understanding
  // 3. Communication: Prioritizing being understood over perfect fluency
  const questions = [
    { 
      id: 'grammar_1', 
      text: 'Quando encontrar uma construção linguística que soa estranha, você tenta entender POR QUE ela soa assim?' 
    },
    { 
      id: 'logic_1', 
      text: 'Você costuma revisitar ideias que acreditava estar dominadas para verificar se realmente as compreende?' 
    },
    { 
      id: 'communication_1', 
      text: 'Ao se expressar em situações reais, você prioriza fazer-se entender sobre falar perfeitamente?' 
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        answers,
        interest, // Include interest for lesson generation
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setShareLink(`https://liceu.underground/diagnostico/${data.share_token}`);
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg">
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border mb-4"
            required
          />
          
          <label className="block mb-2">Memory Palace Hook (e.g., *\"minha casa\"*, *\"cachorro\"*):</label>
          <input
            type="text"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full p-2 border mb-4"
            placeholder="Onde você quer ancorar essa lição?"
            required
          />
          
          {questions.map((q) => (
            <div key={q.id} className="mb-4">
              <p>{q.text}</p>
              {[1, 2, 3, 4, 5].map((val) => (
                <label key={val} className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name={q.id}
                    value={val}
                    onChange={() => setAnswers({ ...answers, [q.id]: val })}
                    required
                  />
                  <span className="ml-1">{val}</span>
                </label>
              ))}
            </div>
          ))}
          
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Enviar
          </button>
        </form>
      ) : (
        <div>
          <h3 className="font-bold">Obrigado!</h3>
          <p>Compartilhe seu resultado:</p>
          <input
            type="text"
            value={shareLink}
            readOnly
            className="w-full p-2 border mb-2"
          />
          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Copiar link
          </button>
        </div>
      )}
    </div>
  );
}