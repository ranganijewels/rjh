export const useExchangeRate = (from = "USD", to = "USD") => {
  const [rate, setRate] = useState(0);
  useEffect(() => {
    fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((data) => setRate(data?.result || 0.0162))
      .catch((err) => console.error(err));
  }, [from, to]);

  return rate;
};
