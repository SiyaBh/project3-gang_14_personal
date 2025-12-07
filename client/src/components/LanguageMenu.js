import { useTranslation } from "../context/TranslationContext";
import T from "./T";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="en"><T text = "English"/></option>
      <option value="es"><T text = "Spanish"/></option>
    </select>
  );
}