import { useCallback, useState } from 'react';

const useBoolState = (initialValue = false): readonly [boolean, () => void, () => void] => {
  const [isHovered, setIsHovered] = useState(initialValue);

  const setEnabled = useCallback(() => {
    setIsHovered(true);
  }, []);
  const setDisabled = useCallback(() => {
    setIsHovered(false);
  }, []);

  return [isHovered, setEnabled, setDisabled];
};

export default useBoolState;
