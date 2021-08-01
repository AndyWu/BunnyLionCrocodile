import React, { useState } from 'react';
import styled from 'styled-components';
import { getPhrases, getSentences, getParagraphs } from './utils';
import map from './loader';

const STORY = `（中央社記者楊啟芳台北31日電）「麟洋配」王齊麟和李洋今天在東京奧運羽球男雙勇奪金牌，賽後王齊麟興奮地在臉書發文，「我是台灣羽球選手王齊麟。」李洋則說：「我是金門人，我來自台灣。」

今天對上中國組合劉雨辰、李俊慧的金牌戰，王齊麟和李洋在首局雖然一度落後，不過之後愈打愈順，反倒以21比18逆轉拿下；第2局則是一路領先，最終以21比18、21比12摘下金牌，為台灣拿下奧運羽球項目首金。

賽後王齊麟發文再度貼出國旗，他表示，「請大家告訴我！這是真的嗎？我們麟洋讓世界看見台灣了，我們麟洋真的做到了！再次向全世界大聲的自我介紹，我是台灣羽球選手王齊麟，I am Wang Chi Lin，I am from Taiwan。」

李洋也貼文表示，「難以置信的站上奧運冠軍的頒獎台上，看著我們中華台北的旗子升起，唱著我們中華民國的國旗歌，內心的感動和激動無法言喻，今天，我要很驕傲的再次告訴大家，我是李洋，我是金門人，我來自台灣。」

李洋也說：「我們麟洋讓世界看見了台灣，謝謝所有支持我們，幫助我們，為我們一路加油的所有人，這份奧運殿堂上最高的榮耀，獻給我的國家－台灣，並與所有支持我們的人分享。」（編輯：張銘坤）1100731`;

const TONE_DOT = '˙';
const TONE_2ND = 'ˊ';
const TONE_3RD = 'ˇ';
const TONE_4TH = 'ˋ';

const OriginalStory = styled.textarea`
  height: 200px;
  width: calc(100% - 2px - 10px);
  margin: 0 0 5px 0;
  padding: 5px;
`;

const ControlPanel = styled.div`
  height: 30px;
  width: calc(100% - 2px - 10px);
  margin: 5px 0;
  // border: 1px solid #000;
  padding: 5px;
`;

const ZuYinStory = styled.div`
  writing-mode: vertical-rl;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  height: calc(100% - 10px - 200px - 30px - 10px - 10px - 2px * 4 - 5px * 6);
  width: calc(100% - 2px - 10px);
  border: 1px solid #000;
  text-align: left;
  margin: 5px 0 0 0;
  padding: 5px;
  overflow-x: scroll;
  overflow-y: auto;
`;

const Paragraph = styled.div`
  writing-mode: vertical-rl;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  height: 100%;
  // border: 1px solid red;
  text-align: left;
  margin: 5px 0 0 0;
  padding: 5px;
  overflow-x: scroll;
  overflow-y: auto;
`;

const CharacterZuYinBlock = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: 75px;
  height: 60px;
  // border: 1px solid black;
`;

const CharacterBlock = styled.div`
  writing-mode: rl;
  width: 50px;
  height: 50px;
  // border: 1px solid blue;
  text-align: left;
  line-height: 50px;
  font-size: 50px;
  margin: 0;
  padding: 0;
`;
const ZuYinBlock = styled.div`
  writing-mode: rl;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin: 0;
  padding: 0;
  width: 13px;
  height: 50px;
  // line-height: 13px;
  font-size: 13px;
  // border: 1px solid red;
`;
const Phonetic = styled.div`
  writing-mode: rl;
  margin: 0;
  padding: 0;
  width: 13px;
  height: 13px;
  text-align: center;
  // border: 1px solid red;
  line-height: 13px;
  font-size: 13px;
`;
const Tone = styled.div`
  writing-mode: rl;
  margin: ${(prop) => {
    switch (prop.type) {
      case TONE_DOT:
        return '0 0 -5px 0';
      case TONE_2ND:
        return '-15px -8px 0 0';
      case TONE_3RD:
        return '-15px -8px 0 0';
      case TONE_4TH:
        return '-15px -8px 0 0';
      default:
        return '0';
    }
  }};
  padding: 0;
  width: 13px;
  height: 13px;
  text-align: center;
  // border: 1px solid green;
  line-height: 13px;
  font-size: 13px;
`;

const WordBlock = (char, zuYin, idx) => {
  let zuYinBlock = null;
  if (zuYin) {
    if (zuYin.includes(TONE_DOT)) {
      zuYinBlock = (
        <ZuYinBlock>
          <Tone type={TONE_DOT}>{TONE_DOT}</Tone>
          {zuYin
            .split('')
            .filter((z) => z !== TONE_DOT)
            .map((z) => (
              <Phonetic key={z}>{z}</Phonetic>
            ))}
        </ZuYinBlock>
      );
    } else if (zuYin.includes(TONE_2ND)) {
      zuYinBlock = (
        <ZuYinBlock>
          {zuYin
            .split('')
            .filter((z) => z !== TONE_2ND)
            .map((z) => (
              <Phonetic key={z}>{z}</Phonetic>
            ))}
          <Tone type={TONE_2ND}>{TONE_2ND}</Tone>
        </ZuYinBlock>
      );
    } else if (zuYin.includes(TONE_3RD)) {
      zuYinBlock = (
        <ZuYinBlock>
          {zuYin
            .split('')
            .filter((z) => z !== TONE_3RD)
            .map((z) => (
              <Phonetic key={z}>{z}</Phonetic>
            ))}
          <Tone type={TONE_3RD}>{TONE_3RD}</Tone>
        </ZuYinBlock>
      );
    } else if (zuYin.includes(TONE_4TH)) {
      zuYinBlock = (
        <ZuYinBlock>
          {zuYin
            .split('')
            .filter((z) => z !== TONE_4TH)
            .map((z) => (
              <Phonetic key={z}>{z}</Phonetic>
            ))}
          <Tone type={TONE_4TH}>{TONE_4TH}</Tone>
        </ZuYinBlock>
      );
    } else {
      zuYinBlock = (
        <ZuYinBlock>
          {zuYin.split('').map((z) => (
            <Phonetic key={z}>{z}</Phonetic>
          ))}
        </ZuYinBlock>
      );
    }
  }

  return (
    <CharacterZuYinBlock key={idx}>
      <CharacterBlock>{char}</CharacterBlock>
      {zuYinBlock}
    </CharacterZuYinBlock>
  );
};

const WordBlocks = (phrases, idx) => {
  const chars = phrases.map((p) => p.split('')).flat();
  const zuYins = phrases.map((p) => (map[p] ? map[p].split(' ') : null)).flat();

  return chars.map((c, i) => WordBlock(c, zuYins[i]?.replace('-', ''), `${idx}_${i}`));
};

const App = () => {
  const [storyTexts, setStoryTexts] = useState(STORY);
  const paragraphs = getParagraphs(storyTexts);
  const paragraphComp = paragraphs.map((paragraph, idx) => {
    const sentences = getSentences(` ${paragraph}`, map);
    const phrasesInSentences = sentences.map((sentence) => getPhrases(sentence, map));
    const words = phrasesInSentences.map((phrase, i) => WordBlocks(phrase, i));
    return {
      words: words.flat(),
      key: idx,
    };
  });

  return (
    <>
      <OriginalStory
        value={storyTexts}
        onChange={(evt) => {
          setStoryTexts(evt.target.value);
        }}
      />
      <ControlPanel>
        <a href="https://github.com/AndyWu/BunnyLionCrocodile">BunnyLionCrocodile</a>
        {' '}
        App: 請在上方區塊貼上想要加註注音的文字
      </ControlPanel>
      <ZuYinStory>
        {paragraphComp.map((p) => <Paragraph key={p.key}>{p.words}</Paragraph>)}
      </ZuYinStory>
    </>
  );
};

export default App;
