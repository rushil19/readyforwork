const response = await fetch("https://script.google.com/macros/s/AKfycbz3OyJDBVKBvdNh4wR8nxQIdC9TQMaDJgrImaA3E_ats2bCyiCBYm9CirnTKOQxTLdjoQ/exec", {
  method: "POST",
  mode: "no-cors", // Crucial: Tells the browser not to wait for a CORS header
  cache: "no-cache",
  headers: {
    "Content-Type": "text/plain", // Keep this as text/plain to avoid pre-flight errors
  },
  body: JSON.stringify(formData),
});
