// Add 'export' at the beginning!
export const submitResults = async (formData: any) => { 
  const response = await fetch("https://script.google.com/macros/s/AKfycbzyn5hGk8VFeTwgbwikqkNssZPBJiOarbtCllduV7GhW2yz67ebsd2tXf6v6qVOeYQIHQ/exec", {
    method: "POST",
    mode: "no-cors",
    // ... the rest of your code ...
  });
};
