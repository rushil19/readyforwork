const scriptURL = "https://script.google.com/macros/s/AKfycbzzdbfMz9fe6B0_UbvYZa6_mv1i8LUo-jrBaMgwRR6KZ1sc70MNgRzwiul3FS6sELjRdQ/exec";

export async function submitResults(data: any) {
  try {
    await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("Results saved successfully");
  } catch (error) {
    console.error("Error saving results:", error);
  }
}
