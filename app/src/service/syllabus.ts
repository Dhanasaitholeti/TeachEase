const getHolidays = async (): Promise<any> => {
    try {
      const year = new Date().getFullYear();
      const apiKey = process.env.NEXT_PUBLIC_NINJAS_API_KEY; // ✅ Load API key from environment variables
  
      if (!apiKey) {
        console.error("API key is missing. Check your .env.local file.");
        return null;
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NINJAS_API_URL}v1/holidays?country=IN&year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey, // ✅ Securely use the API key
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return null;
    }
  };
  
  export { getHolidays };
  