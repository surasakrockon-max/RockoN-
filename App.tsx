
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Lightbulb, Camera, Download, RotateCcw, Palette, Briefcase, Building, Share, Sun, Moon, Globe, Twitter, Linkedin,
    Sparkles, Zap, History as HistoryIcon, Trash2, Copy
} from './components/icons';
import { generateImage } from './services/geminiService';
import { ArtStyle, HistoryItem } from './types';
import { translations } from './i18n/locales';

// --- Custom Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error)
      {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

const useTranslation = () => {
    const [language, setLanguage] = useLocalStorage<'en' | 'th'>('language', 'en');

    const t = (key: keyof typeof translations.en, params?: Record<string, string>) => {
        let translation = translations[language][key] || translations.en[key];
        if (params) {
            Object.keys(params).forEach(pKey => {
                translation = translation.replace(`{{${pKey}}}`, params[pKey]);
            });
        }
        return translation;
    };
    
    const cycleLanguage = () => {
        setLanguage(lang => lang === 'en' ? 'th' : 'en');
    }

    return { t, language, cycleLanguage };
};


// --- Main App Component ---
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, cycleLanguage } = useTranslation();
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('product');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'quality' | 'speed'>('quality');
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('generation-history', []);

  const styles: ArtStyle[] = useMemo(() => [
    { id: 'product', name: t('styleProduct'), icon: Camera, promptSuffix: 'professional product photography, studio lighting, clean background, 8k, hyperrealistic, commercial, on a plain background' },
    { id: 'logo', name: t('styleLogo'), icon: Palette, promptSuffix: 'minimalist logo design, vector art, clean lines, flat design, centered on a plain background' },
    { id: 'marketing', name: t('styleMarketing'), icon: Briefcase, promptSuffix: 'vibrant marketing material, advertising style, engaging illustration, eye-catching composition, for a social media post' },
    { id: 'architecture', name: t('styleArchitecture'), icon: Building, promptSuffix: 'architectural visualization, 3d render, modern design, realistic lighting, exterior shot' },
  ], [t]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const selectedStyleDetails = styles.find(s => s.id === selectedStyle);
      const fullPrompt = `${prompt}, ${selectedStyleDetails?.promptSuffix || ''}`;
      
      const imageBase64 = await generateImage(fullPrompt, mode);
      
      if (imageBase64) {
        const imageDataUrl = `data:image/png;base64,${imageBase64}`;
        setGeneratedImage(imageDataUrl);

        const newHistoryItem: HistoryItem = {
            id: crypto.randomUUID(),
            imageDataUrl,
            prompt,
            styleId: selectedStyle,
            timestamp: Date.now()
        };
        setHistory(prev => [newHistoryItem, ...prev]);

      } else {
        setError(t('errorNoImage'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorUnknown'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setError(null);
  };

  const handleReuse = (item: HistoryItem) => {
      setPrompt(item.prompt);
      setSelectedStyle(item.styleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDelete = (id: string) => {
      setHistory(prev => prev.filter(item => item.id !== id));
  };
  const handleClearHistory = () => {
      setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br from-slate-900 via-gray-800 to-black text-gray-800 dark:text-white transition-colors duration-300">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        language={language} 
        cycleLanguage={cycleLanguage} 
        t={t}
      />
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-6xl mx-auto">
          <Generator
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            styles={styles}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            handleGenerate={handleGenerate}
            error={error}
            mode={mode}
            setMode={setMode}
            t={t}
          />

          {isGenerating && <LoadingSpinner t={t} />}

          {generatedImage && (
            <ResultDisplay
              generatedImage={generatedImage}
              prompt={prompt}
              handleReset={handleReset}
              setError={setError}
              t={t}
            />
          )}

          {!generatedImage && !isGenerating && <FeatureCards t={t}/>}
          
          <History
              items={history}
              styles={styles}
              onReuse={handleReuse}
              onDelete={handleDelete}
              onClear={handleClearHistory}
              t={t}
          />
        </main>
      </div>
      <Footer t={t} />
    </div>
  );
}


// --- Sub-components ---

const Header: React.FC<{ theme: string; toggleTheme: () => void; language: string; cycleLanguage: () => void; t: (key: any) => string; }> = ({ theme, toggleTheme, language, cycleLanguage, t }) => (
    <header className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
             <div className="flex items-center justify-center">
                <Lightbulb className="w-7 h-7 text-amber-500 mr-2" />
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                    {t('titleShort')}
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={cycleLanguage}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={t('lang_toggle')}
                >
                    <Globe className="w-5 h-5" />
                </button>
                <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={t('theme_toggle')}
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
            </div>
        </div>
    </header>
);

const Generator: React.FC<{
    prompt: string, setPrompt: (p: string) => void, isGenerating: boolean, styles: ArtStyle[],
    selectedStyle: string, setSelectedStyle: (s: string) => void, handleGenerate: () => void,
    error: string | null, mode: 'quality' | 'speed', setMode: (m: 'quality' | 'speed') => void, t: (key: any) => string
}> = ({ prompt, setPrompt, isGenerating, styles, selectedStyle, setSelectedStyle, handleGenerate, error, mode, setMode, t }) => (
    <section className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 my-8 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold">{t('title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-2">
                {t('description')}
            </p>
        </div>
        <div className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
                <label htmlFor="prompt-input" className="block text-sm font-medium mb-2">
                    {t('promptLabel')}
                </label>
                <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('promptPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all"
                    rows={3}
                    disabled={isGenerating}
                />
            </div>
            <div className="md:col-span-4">
                <label className="block text-sm font-medium mb-2">
                    {t('styleLabel')}
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-2">
                    {styles.map((style) => {
                        const Icon = style.icon;
                        return (
                            <button
                                key={style.id}
                                onClick={() => setSelectedStyle(style.id)}
                                disabled={isGenerating}
                                className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center text-center disabled:opacity-50 ${
                                selectedStyle === style.id
                                    ? 'bg-amber-500 border-amber-400 text-black font-semibold'
                                    : 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                                }`}
                                title={style.name}
                            >
                                <Icon className="w-5 h-5 mb-1" />
                                <span className="text-xs font-medium">{style.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
                 <button 
                    onClick={() => setMode('quality')}
                    disabled={isGenerating}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${mode === 'quality' ? 'bg-white dark:bg-black shadow' : 'text-gray-600 dark:text-gray-300'}`}
                 >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {t('modeQuality')}
                 </button>
                 <button 
                    onClick={() => setMode('speed')}
                    disabled={isGenerating}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${mode === 'speed' ? 'bg-white dark:bg-black shadow' : 'text-gray-600 dark:text-gray-300'}`}
                 >
                    <Zap className="w-4 h-4 text-blue-500" />
                    {t('modeSpeed')}
                 </button>
            </div>
           
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30"
            >
                {isGenerating ? (
                    <>
                        <div className="w-5 h-5 border-2 border-black/50 border-t-black rounded-full animate-spin"></div>
                        <span>{t('generatingButton')}</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        <span>{t('generateButton')}</span>
                    </>
                )}
            </button>
        </div>
        {error && <div className="mt-4 text-center text-red-500 bg-red-500/10 p-3 rounded-lg">{t('errorLabel')}: {error}</div>}
    </section>
);


const LoadingSpinner: React.FC<{ t: (key: any) => string }> = ({ t }) => (
    <div className="text-center my-12">
        <div className="inline-block w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t('loadingMessage')}</p>
    </div>
);

const ResultDisplay: React.FC<{
    generatedImage: string, prompt: string, handleReset: () => void,
    setError: (e: string | null) => void, t: (key: any, params?: any) => string
}> = ({ generatedImage, prompt, handleReset, setError, t }) => {
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `ai-visual-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        setError(null);
        const shareData: ShareData = {
            title: t('shareTitle'),
            text: t('shareText', { prompt }),
        };

        try {
            if (!navigator.canShare) {
                setError(t('errorNoShare'));
                return;
            }

            // Convert data URL to Blob for file sharing
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            const file = new File([blob], 'ai-visual.png', { type: blob.type });

            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ ...shareData, files: [file] });
            } else if (navigator.canShare(shareData)) {
                 await navigator.share(shareData);
            } else {
                setError(t('errorNoFileShare'));
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                 setError(`${t('errorShare')}: ${err.message}`);
            }
        }
    };

    return (
        <section className="my-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">{t('resultTitle')}</h2>
            <div className="relative group max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                <img src={generatedImage} alt={t('altGenerated')} className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <p className="text-white text-center text-sm">{prompt}</p>
                </div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={handleReset}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span>{t('newButton')}</span>
                </button>
                <button
                    onClick={handleDownload}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                    <Download className="w-5 h-5" />
                    <span>{t('downloadButton')}</span>
                </button>
                <button
                    onClick={handleShare}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                    <Share className="w-5 h-5" />
                    <span>{t('shareButton')}</span>
                </button>
            </div>
        </section>
    );
};

const FeatureCards: React.FC<{t: (key: any) => string;}> = ({t}) => (
    <div className="grid md:grid-cols-3 gap-6 my-12">
        <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Palette className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-bold text-lg">{t('featureLogoTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t('featureLogoDesc')}</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Camera className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-bold text-lg">{t('featureMockupTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t('featureMockupDesc')}</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Briefcase className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-bold text-lg">{t('featureMarketingTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t('featureMarketingDesc')}</p>
        </div>
    </div>
);

const History: React.FC<{
    items: HistoryItem[],
    styles: ArtStyle[],
    onReuse: (item: HistoryItem) => void,
    onDelete: (id: string) => void,
    onClear: () => void,
    t: (key: any) => string
}> = ({ items, styles, onReuse, onDelete, onClear, t }) => {
    if (items.length === 0) return null;

    return (
        <section className="my-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <HistoryIcon />
                    {t('historyTitle')}
                </h2>
                {items.length > 0 && (
                     <button 
                        onClick={onClear} 
                        className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                     >
                        <Trash2 className="w-4 h-4" />
                        {t('historyClear')}
                     </button>
                )}
            </div>
           
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map(item => {
                    const style = styles.find(s => s.id === item.styleId);
                    return (
                        <div key={item.id} className="relative group bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                            <img src={item.imageDataUrl} alt={item.prompt} className="w-full h-40 object-cover" />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                                <p className="text-white text-xs font-medium line-clamp-3">{item.prompt}</p>
                                <div>
                                    <div className="flex gap-2 justify-end">
                                        <button 
                                            onClick={() => onReuse(item)} 
                                            className="p-1.5 bg-blue-500/80 hover:bg-blue-500 rounded-full"
                                            title={t('reusePrompt')}
                                        >
                                            <Copy className="w-4 h-4 text-white" />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(item.id)} 
                                            className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full"
                                            title={t('deleteItem')}
                                        >
                                            <Trash2 className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const Footer: React.FC<{t: (key: any) => string}> = ({t}) => (
    <footer className="bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} {t('title')}. {t('footerRights')}</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-amber-500"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-amber-500"><Linkedin className="w-5 h-5" /></a>
            </div>
        </div>
    </footer>
);
