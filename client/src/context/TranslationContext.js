import React, { createContext, useState, useContext, useEffect } from "react";
import { translateText } from "../api/translate";

// define the translation contect so it can be used across the app - "mini global storage bucket"
const TranslationContect = createContext();

// custom hook to use the translation context
export const useTranslation = ()  => useContext(TranslationContect);

// create the wrapper component that will provide the translation context to its children
export const TranslationProvider = ({ children }) => {

    // stores translations already fetched to avoid redundant API calls
    const [cache, setCache] = useState({}); 

    // language holds the current langauge, setLanguage is the function to change it
    const [language, setLanguage] = useState(
        () => localStorage.getItem("language") || "en"
    );

    useEffect(() => {
    localStorage.setItem("language", language);
    }, [language]);

    useEffect(() => {
    const saved = localStorage.getItem("translation_cache");
    if (saved) setCache(JSON.parse(saved));
    }, []);

    useEffect(() => {
    localStorage.setItem("translation_cache", JSON.stringify(cache));
    }, [cache]);

const translate = async (text) => {
    // if the language is English, return the original text
    if (language === "en") return text; 

    if (!text) return "";  

    // create a cache key to store the translation
    const cacheKey = `${language}:${text}`;

    // check if the translation is already in the cache and if so, return it
    if (cache[cacheKey]) return cache[cacheKey];

    // send text and target language to the translation API
    const result = await translateText(text, language);

    // gets back translated text
    const translated = result.translatedText;

    // store the translation in the cache for future use
    setCache(prev => ({ ...prev, [cacheKey]: translated }));

    return translated;
};

    return (
        <TranslationContect.Provider value={{ language, setLanguage, translate }}>
            {children}
        </TranslationContect.Provider>
    );
};

