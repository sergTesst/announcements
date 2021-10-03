import React from 'react';
import { useState } from "react";
import styles from './ReadMoreText.module.scss';

export const ReadMoreText = ({ content, maxCharCount }) => {

  const textShortPart = content.substring(0, maxCharCount);
  const textRemainingPart = content.substring(maxCharCount, content.length);

  const [readMoreSpan, setReadMoreState] = useState(false);
  const [readMoreText, setReadMoreText] = useState("read more");
  const setReadMoreParams = () => {
    setReadMoreState(!readMoreSpan);
    if (readMoreSpan) {
      setReadMoreText(" read more");
    } else {
      setReadMoreText(" read less");
    }
  };

  if(textRemainingPart.length === 0){
    return (
      <React.Fragment>
        {textShortPart}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {textShortPart}

      {!readMoreSpan && <span className="dots">...</span>}

      {readMoreSpan && <span className="more">{textRemainingPart}</span>}

      <span onClick={setReadMoreParams} className={styles.readmore}>
        {readMoreText}
      </span>
    </React.Fragment>
  );
};