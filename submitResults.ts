export const submitResults = async (formData: any) => {
  // We convert your data into a URL-friendly string
  const queryString = new URLSearchParams({
    data: JSON.stringify(formData)
  }).toString();

  const scriptURL = "https://script.google.com/macros/s/AKfycbxHqOLC3KsnWRcH06xOwGzXfL--R_PUbLWWmtvN-nI1JxMMVgaDrTY9vUuNfCkWUoxTng/exec";

  // We attach the data directly to the URL after a '?'
  await fetch(`${scriptURL}?${queryString}`, {
    method: "GET", // Changing to GET is often more stable for simple data
    mode: "no-cors",
    cache: "no-cache"
  });
};
