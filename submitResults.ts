const scriptURL = "https://script.google.com/macros/s/AKfycbx1NjSDa0VHQAMbEHS1rUmtBeABLhQxt9SpX0Z7ihxEsToWPKx-RnZyq0HHT_4NuJw7YQ/exec";

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
