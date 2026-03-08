// Add 'export' at the beginning!
export const submitResults = async (formData: any) => { 
  const response = await fetch("https://script.google.com/macros/s/AKfycbxQKAvJjxg_JUb_90Po8Rm4gyUP9mQxjc3NDnhkqDky1kg--aNrV4UaDpsUap__66mTig/exec", {
    method: "POST",
    mode: "no-cors",
    // ... the rest of your code ...
  });
};
