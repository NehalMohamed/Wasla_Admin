 export const fetchUserCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log("User country:", data.country_name); // e.g., "United States"
      return data.country_name;
    } catch (error) {
      console.error("Failed to get country", error);
    }
  };
  
  export const getCurrencyFromCountry = async (countryCode) => {
  const response = await fetch("https://restcountries.com/v3.1/name/"+countryCode+"?fields=currencies");
  let data = await response.json();
  return Object.keys(data[0].currencies)[0]; // e.g., "USD"
};

