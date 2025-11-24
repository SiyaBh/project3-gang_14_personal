import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";

export default function T({ text }) {
  const { translate } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    async function doTranslate() {
      const t = await translate(text);
      setTranslated(t);
    }
    doTranslate();
  }, [text, translate]);

  return translated;
}