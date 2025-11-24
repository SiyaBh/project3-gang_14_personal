import { useTranslation } from "../context/TranslationContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{ padding: "8px", margin: "10px" }}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}