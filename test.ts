// Sample data
const data = [
  {
    price: "3069.155",
    time: "1731877380",
  },
  {
    price: "3069.1744166666666667",
    time: "1731877368",
  },
  {
    price: "3069.1938333333333334",
    time: "1731877356",
  },
];

// Parse the dates
const parsedData = data.map((item) => ({
  price: parseFloat(item.price),
  // Convert seconds to milliseconds by multiplying by 1000
  time: new Date(parseInt(item.time) * 1000),
  originalTime: item.time,
}));

// Display the parsed data
console.log("Parsed Data Results:");
console.log("-------------------");
parsedData.forEach((item) => {
  console.log({
    price: item.price.toFixed(4),
    isoTime: item.time.toISOString(),
    localTime: item.time.toLocaleString(),
    originalTimestamp: item.originalTime,
  });
});
