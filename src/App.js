import logo from "./logo.svg";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import HistoryTable from "./components/HistoryTable";
function verificationTaux(tauxModifie, tauxReel) {
  const variation = tauxReel * (1 + 2 / 100);
  return tauxModifie < variation;
}

function App() {
  const [tauxchange, setTauxchange] = useState(1.1);
  const [tauxChangePerso, setTauxChangePerso] = useState(1.1);
  const [userValue, setUserValue] = useState(0);
  const [convertedValue, setConvertedValue] = useState(0);
  const [switchCurrency, setSwitchCurrency] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Option 1");
  const selectedOptionRef = useRef(selectedOption);
  const [listData, setListData] = useState([]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    selectedOptionRef.current = event.target.value;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.random() * 0.1 - 0.05;
      setTauxchange(tauxchange + randomValue);

      if (selectedOptionRef.current === "Option 1")
        setConvertedValue(userValue * tauxchange);
      else if (selectedOptionRef.current === "Option 2") {
        if (verificationTaux(tauxChangePerso, tauxchange))
          setConvertedValue(userValue * tauxChangePerso);
        else {
          setConvertedValue(userValue * tauxchange);
          setSelectedOption("Option 1");
          selectedOptionRef.current = "Option 1";
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [tauxchange, convertedValue, userValue]);

  const handleInputChange = (event) => {
    setUserValue(event.target.value);
  };

  const handleInputBlur = () => {
    // verifier si le input radio est checker sur la premiere condition
    if (selectedOptionRef.current === "Option 1")
      setConvertedValue(userValue * tauxchange);
    else if (selectedOptionRef.current === "Option 2") {
      //verifier si la valeur entree est inferieur a 2% du taux reel
      if (verificationTaux(tauxChangePerso, tauxchange))
        setConvertedValue(userValue * tauxChangePerso);
      else {
        //
        setConvertedValue(userValue * tauxchange);
        setSelectedOption("Option 1");
        selectedOptionRef.current = "Option 1";
      }
    }
    //ajouter la ligne dans le tableau
    const convertedValueWithCurrency = convertedValue
      .toString()
      .concat(switchCurrency ? "€" : "$");
    const initialValueWithCurrency = userValue
      .toString()
      .concat(switchCurrency ? "$" : "€");
    const newData = {
      tauxR: tauxchange,
      tauxS: tauxChangePerso,
      valeurI: initialValueWithCurrency,
      valeurC: convertedValueWithCurrency,
    };
    setListData([...listData, newData]);
  };

  const handleInputChangeTauxPerso = (event) => {
    setTauxChangePerso(event.target.value);
  };

  const handleInputKeyDownTauxPerso = (event) => {
    if (event.key === "Enter") {
      setTauxChangePerso(event.target.value);
    }
  };

  const handleSwitchCurrency = (event) => {
    setTauxchange(1 / tauxchange);
    var oldUserInput = userValue;
    setUserValue(convertedValue);
    setConvertedValue(oldUserInput);
    setSwitchCurrency(!switchCurrency);
  };

  return (
    <div className="App">
      <div className="table-container">
        <div className="row1">
          <div className="col1">
            Taux de change : {switchCurrency ? "$/€" : "€/$"}{" "}
          </div>
          <div className="col2">
            <input value={tauxchange} readOnly />
          </div>
          <div className="col3">
            <div>
              <input
                type="radio"
                value="Option 1"
                name="radiotype"
                checked={selectedOption === "Option 1"}
                onChange={handleOptionChange}
              />
              <label htmlFor="Option 1">
                {selectedOption === "Option 1" ? "" : ""}
              </label>
            </div>
          </div>
        </div>
        <div className="row2">
          <div className="col1">Taux de change personalisé : </div>
          <div className="col2">
            <input
              type="number"
              value={tauxChangePerso}
              onChange={handleInputChangeTauxPerso}
              onKeyDown={handleInputKeyDownTauxPerso}
            />
          </div>
          <div className="col3">
            <div>
              <input
                type="radio"
                value="Option 2"
                name="radiotype"
                checked={selectedOption === "Option 2"}
                onChange={handleOptionChange}
              />
              <label htmlFor="Option 2">
                {selectedOption === "Option 2" ? "" : ""}
              </label>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="button-container">
        <input
          type="number"
          value={userValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        <span>{switchCurrency ? "$" : "€"}</span>
        =
        <input type="number" value={convertedValue} readOnly />
        <span>{switchCurrency ? "€" : "$"}</span>
        <br />
        <button onClick={handleSwitchCurrency}>Inverser les devises</button>
      </div>
      <HistoryTable data={listData}></HistoryTable>
    </div>
  );
}

export default App;
