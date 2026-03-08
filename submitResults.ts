const response = await fetch(https://script.google.com/macros/s/AKfycbzzdbfMz9fe6B0_UbvYZa6_mv1i8LUo-jrBaMgwRR6KZ1sc70MNgRzwiul3FS6sELjRdQ/exec, {
  method: "POST",
  mode: "no-cors", // Crucial: Tells the browser not to wait for a CORS header
  cache: "no-cache",
  headers: {
    "Content-Type": "text/plain", // Keep this as text/plain to avoid pre-flight errors
  },
  body: JSON.stringify(formData),
});
