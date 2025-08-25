import { useEffect, useState } from 'react';
import './App.css';
import { DEFAULT_BASE_CODE, DEFAULT_BASE_VALUE, DEFAULT_TARGET_CODE, DEFAULT_TARGET_VALUE, DEFAULT_TO_FIXED } from './constants';
import Spinner from './components/spinner/spinner';
import Currency from './components/currency/Currency';
import { useConvert } from './hooks/useConvert';


const ErrorDisplay = ({ description, onClose }: { description: string, onClose: () => void }) => (
  <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
    {description}
    <button onClick={onClose} style={{ marginLeft: '10px' }}>Close</button>
  </div>
);

function App() {
  const [baseCode, setBaseCode] = useState(DEFAULT_BASE_CODE);
  const [targetCode, setTargetCode] = useState(DEFAULT_TARGET_CODE);
  const [baseValue, setBaseValue] = useState<number | null>(DEFAULT_BASE_VALUE);
  const [targetValue, setTargetValue] = useState<number | null>(DEFAULT_TARGET_VALUE);
  
  const { conversionRate, isLoading, error, clearError } = useConvert({
    baseCode,
    targetCode
  });

  const onBaseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const value = inputValue === '' ? null : Number(inputValue);
    
    if (inputValue !== '' && isNaN(value as number)) {
      return;
    }
    
    setBaseValue(value);
    
    if (value !== null && conversionRate > 0) {
      const calculatedTargetValue = Number((value * conversionRate).toFixed(DEFAULT_TO_FIXED));
      setTargetValue(calculatedTargetValue);
      console.log(`Converting ${value} ${baseCode} to ${calculatedTargetValue} ${targetCode} (rate: ${conversionRate})`);
    } else {
      setTargetValue(null);
    }
  };
  
  const onTargetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const value = inputValue === '' ? null : Number(inputValue);
    
    if (inputValue !== '' && isNaN(value as number)) {
      return;
    }
    
    setTargetValue(value);
    
    if (value !== null && conversionRate > 0) {
      const calculatedBaseValue = Number((value / conversionRate).toFixed(DEFAULT_TO_FIXED));
      setBaseValue(calculatedBaseValue);
      console.log(`Converting ${value} ${targetCode} to ${calculatedBaseValue} ${baseCode} (rate: ${conversionRate})`);
    } else {
      setBaseValue(null);
    }
  }; 

  const setDefaultValues = () => {
    setBaseValue(DEFAULT_BASE_VALUE);
    setTargetValue(DEFAULT_TARGET_VALUE);
  };

  const onBaseCodeChange = (value: string) => {
    setDefaultValues();
    setBaseCode(value);
  }; 
  
  const onTargetCodeChange = (value: string) => {
    setDefaultValues();
    setTargetCode(value);
  }; 

  useEffect(() => {
    if (conversionRate > 0 && baseValue !== null) {
      const newTargetValue = Number((baseValue * conversionRate).toFixed(DEFAULT_TO_FIXED));
      setTargetValue(newTargetValue);
      console.log(`Conversion rate updated: ${baseValue} ${baseCode} = ${newTargetValue} ${targetCode}`);
    }
  }, [conversionRate, baseValue, baseCode, targetCode]);

  return (
    <>
      {isLoading && <Spinner />}
      {error && <ErrorDisplay description={error} onClose={clearError}/>}
      <div className='container'>
        <h1>Конвертер валют</h1>
        <Currency
          hasMargin
          inputValue={baseValue}
          inputDisabled={isLoading}
          selectValue={baseCode}
          onInputChange={onBaseValueChange}
          onSelectChange={onBaseCodeChange}
        />
        <Currency
          hasMargin
          inputValue={targetValue}
          inputDisabled={isLoading}
          selectValue={targetCode}
          onInputChange={onTargetValueChange}
          onSelectChange={onTargetCodeChange}
        />
      </div>
    </>
  );
}

export default App;