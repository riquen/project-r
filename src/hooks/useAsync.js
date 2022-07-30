import { useCallback, useEffect, useState } from 'react';

const useAsync = (asyncFunction, shouldRun) => {
  const [state, setState] = useState({
    result: null,
    error: null,
    status: 'idle',
  });

  const run = useCallback(() => {
    setState({
      result: null,
      error: null,
      status: 'pending',
    });

    return asyncFunction()
      .then((response) => {
        setState({
          result: response,
          error: null,
          status: 'settled',
        });
      })
      .catch((error) => {
        setState({
          result: null,
          error: error,
          status: 'error',
        });
      });
  }, [asyncFunction]);

  useEffect(() => {
    shouldRun && run();
  }, [run, shouldRun]);

  const { result, error, status } = state;

  return [run, result, error, status];
};

export default useAsync;
