import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export function TypewriterText({ words = ["Connected.", "Collaborative.", "Digitized.", "Reimagined."], text }) {
  // Support legacy `text` prop by wrapping in array if passed
  const wordList = useMemo(() => text ? [text] : words, [text, words]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId;
    const currentWord = wordList[currentWordIndex];

    const type = () => {
      if (!isDeleting) {
        if (displayedText !== currentWord) {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        } else {
          timeoutId = setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        if (displayedText !== '') {
          setDisplayedText(currentWord.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % wordList.length);
        }
      }
    };

    // Calculate typing speed based on whether deleting or typing
    const delay = isDeleting ? 40 : 80;
    
    // Only set standard timeout if we didn't set a delayed one (like waiting before delete)
    timeoutId = timeoutId || setTimeout(type, displayedText === '' && !isDeleting ? 400 : delay);

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, currentWordIndex, wordList]);

  return (
    <span className="inline-flex items-center whitespace-pre">
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[0.9em] bg-brand-500 ml-1 rounded-full"
      />
    </span>
  );
}
