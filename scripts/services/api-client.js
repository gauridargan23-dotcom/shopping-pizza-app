// Network Call Code 
async function donetworkcall() {
  const url =
    "https://gist.githubusercontent.com/gauridargan23-dotcom/04ad874289e3a5bff8a61ad0a3fc078e/raw/31420eeff316f53c77d46911df3006b2b2580ab1/gistfile1.txt";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("API DATA:", data);

    return data;
  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
}

export default donetworkcall;