export default async function getModelFromGoogleDrive(url: string) {
  try {
    const file = fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.blob().then((blob) => URL.createObjectURL(blob)))
      return { status: "success", url: response.blob().then((blob) => URL.createObjectURL(blob)) };
    })}
    catch (error) {
        console.error("Error fetching the model:", error); 
        return { status: "failed", url: "" };
    } 
}