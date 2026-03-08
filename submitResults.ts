const response = await fetch(https://script.google.com/macros/s/AKfycbwNQayBQx873tLzNDUhgG9XDO6pSGzHnSiyLvS0byEgGntlhZ0SM1JMC3dgQh9jiApWQg/exec, {
  method: "POST",
  mode: "no-cors", // Crucial: Tells the browser not to wait for a CORS header
  cache: "no-cache",
  headers: {
    "Content-Type": "text/plain", // Keep this as text/plain to avoid pre-flight errors
  },
  body: JSON.stringify(formData),
});
