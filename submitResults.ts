// Add 'export' at the beginning!
export const submitResults = async (formData: any) => { 
  const response = await fetch("https://script.google.com/macros/s/AKfycbz3OyJDBVKBvdNh4wR8nxQIdC9TQMaDJgrImaA3E_ats2bCyiCBYm9CirnTKOQxTLdjoQ/exec", {
    method: "POST",
    mode: "no-cors",
    // ... the rest of your code ...
  });
};
