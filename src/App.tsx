import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Volume2 } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

function App() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: sourceText,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Translation failed');
      }

      setTranslatedText(data.data.translations[0].translatedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      setTranslatedText('');
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleSpeak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <Languages className="w-10 h-10 mr-3 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
              Language Translator
            </h1>
          </div>

          {/* Main content */}
          <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-purple-500/20 p-6 border border-gray-800">
            {/* Language selectors */}
            <div className="flex items-center justify-between mb-6">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-[200px] p-3 rounded-lg bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <button
                onClick={swapLanguages}
                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowRightLeft className="w-6 h-6 text-purple-500" />
              </button>

              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-[200px] p-3 rounded-lg bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full h-48 p-4 rounded-lg bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => handleSpeak(sourceText, sourceLang)}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    disabled={!sourceText}
                  >
                    <Volume2 className={`w-5 h-5 ${sourceText ? 'text-purple-500' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  value={translatedText}
                  readOnly
                  placeholder="Translation will appear here..."
                  className="w-full h-48 p-4 rounded-lg bg-gray-800 text-white border-gray-700 placeholder-gray-400 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => handleSpeak(translatedText, targetLang)}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    disabled={!translatedText}
                  >
                    <Volume2 className={`w-5 h-5 ${translatedText ? 'text-purple-500' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 text-red-500 text-center">
                {error}
              </div>
            )}

            {/* Translate button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleTranslate}
                disabled={isLoading || !sourceText.trim()}
                className={`px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg transition-all ${
                  isLoading || !sourceText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {isLoading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;