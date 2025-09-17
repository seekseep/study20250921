import { useState } from "react";

export default function Home() {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Image Upload</h1>
      <input type="file" onChange={handleFileChange} />
      {fileName && <p className="mt-4">Selected file: {fileName}</p>}
    </div>
  );
}
