import { useState, useEffect } from "react";
import Button from "./components/Button/Button";
import InputWord from "./components/InputWord/InputWord";
import { GameMode, GameState, GameTurn } from "./enum";
import { wordsList } from "./data/wordsList";
import RadioGroup from "./components/RadioGroup/RadioGroup";
import "./App.css";

function App() {
  const [gameMode, setGameMode] = useState(GameMode.REGULAR);
  const [gameTurn, setGameTurn] = useState<GameTurn>(GameTurn.USER);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [secretWord, setSecretWord] = useState<string | undefined>();
  const [selectedWords, setselectedWords] = useState<string[]>([]);
  const [blackWordsList, setBlackWordsList] = useState<string[]>([]);
  const [correctGuessedChars, setCorrectGuessedChars] = useState<string[]>([]);
  const [guessedWord, setGuessedWord] = useState(["", "", "", "", ""]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();

  //****** Select a word by [opponent] */
  function opponentGuess() {
    console.log("BLACK LIST words are: ", blackWordsList);
    let filteredWords: string[] = wordsList.filter(
      (word) => !blackWordsList.includes(word)
    );
    console.log(
      "SECRET WORD contains this characters: ",
      Array.from(new Set(correctGuessedChars))
    );
    if (gameMode === (GameMode.REGULAR || GameMode.HARD)) {
      filteredWords = filteredWords.filter((word) =>
        Array.from(new Set(correctGuessedChars)).every((char) =>
          word.includes(char)
        )
      );
    }
    console.log("UnComplete word", guessedWord);
    if (gameMode === GameMode.HARD) {
      filteredWords = filteredWords.filter((word) => {
        const wordChars = word.split("");
        for (let i = 0; i < wordChars.length; i++) {
          if (guessedWord[i] !== "" && guessedWord[i] !== wordChars[i]) {
            return false;
          }
        }
        return true;
      });
    }
    return filteredWords[0];
  }

  //****** If the game ends clear every settings */
  function clearSettings() {
    setselectedWords([]);
    setGameTurn(GameTurn.USER);
    setGuessedWord(["", "", "", "", ""]);
    setCorrectGuessedChars([]);
    setBlackWordsList([]);
    clearTimeout(timeoutId);
  }

  //****** Select a [secret word] for game */
  function chooseSecretWord(words: string[]) {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  //****** Check the equavalence of the user input or robot input with the [secret word] */
  function compareWords(word1: string, word2: string): string {
    let result = "";
    for (let i = 0; i < word1.length; i++) {
      if (word2.includes(word1[i])) {
        const index = word2.indexOf(word1[i]);
        if (index === i) {
          result += `<span style="color:green">${word1[i]}</span>`;
          correctGuessedChars.push(word1[i]);
          setCorrectGuessedChars(correctGuessedChars);
          guessedWord[i] = word1[i];
          setGuessedWord(guessedWord);
        } else {
          correctGuessedChars.push(word1[i]);
          setCorrectGuessedChars(correctGuessedChars);
          result += `<span style="color:yellow">${word1[i]}</span>`;
        }
      } else {
        result += word1[i];
      }
    }
    return result;
  }

  //****** Handle the [TURN] of the game */
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      console.log("GAME TURN IS: ", gameTurn);
      if (gameTurn === GameTurn.USER) {
        const id = setTimeout(() => setGameTurn(GameTurn.ROBOT), 10000);
        setTimeoutId(id);
      } else if (gameTurn === GameTurn.ROBOT) {
        const value = opponentGuess();
        selectedWords.unshift(compareWords(value ?? "", secretWord ?? ""));
        setselectedWords(selectedWords);
        setGameTurn(GameTurn.USER);
        if (value === secretWord) {
          setGameState(GameState.LOST);
        } else if (value !== secretWord) {
          blackWordsList.push(value);
          setBlackWordsList(blackWordsList);
        }
      }
      return clearTimeout(timeoutId);
    }
  }, [gameTurn, gameState]);

  //****** Handle the [STATE] of the game */
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      setSecretWord(chooseSecretWord(wordsList));
    } else if (gameState === GameState.LOST) {
      clearSettings();
    } else if (gameState === GameState.WON) {
      clearSettings();
    }
  }, [gameState]);

  //******* Return this component if user doesn't [START] the game */
  if (gameState === GameState.START) {
    return (
      <div className="App">
        <Button onClick={() => setGameState(GameState.PLAYING)}>
          start the game
        </Button>
        <h3 className="game-mode-text">Choose the game mode</h3>
        <RadioGroup value={gameMode} onChange={setGameMode} />
      </div>
    );
  }

  //******** Return a dialog if user [LOST] the game */
  if (gameState === GameState.LOST) {
    return (
      <div className="App">
        <div className="dialog-box lost-dialog">
          <h1>Game Over!</h1>
          <h3>{`The secret word was: ${secretWord}`}</h3>
          <Button onClick={() => setGameState(GameState.PLAYING)}>
            Play again
          </Button>
          <RadioGroup value={gameMode} onChange={setGameMode} />
        </div>
      </div>
    );
  }

  //******* Return a dialog if user [WON] the game */
  if (gameState === GameState.WON) {
    return (
      <div className="App">
        <div className="dialog-box won-dialog">
          <h1>Congratulation!</h1>
          <h3>{`The secret word was: ${secretWord}`}</h3>
          <Button onClick={() => setGameState(GameState.PLAYING)}>
            Play again
          </Button>
          <RadioGroup value={gameMode} onChange={setGameMode} />
        </div>
      </div>
    );
  }

  //******* Return playground if user is [PLAYING] the game */
  return (
    <div className="App">
      {gameTurn === GameTurn.USER && (
        <InputWord
          onComplete={(value: string) => {
            setGameTurn(GameTurn.ROBOT);
            selectedWords.unshift(compareWords(value ?? "", secretWord ?? ""));
            setselectedWords(selectedWords);
            if (value === secretWord) {
              setGameState(GameState.WON);
            } else {
              blackWordsList.push(value);
              setBlackWordsList(blackWordsList);
            }
          }}
        />
      )}
      <div className="turn-time"></div>
      <h3 className="turn-state-text">
        {gameTurn === GameTurn.USER ? "Your Turn" : "Opponent's Turn"}
      </h3>
      {/* <h3>{`The secret word is: ${secretWord}`}</h3> */}
      <div>
        {selectedWords.map((item) => {
          return (
            <h1
              className="selected-word"
              key={Math.random() * 100}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
