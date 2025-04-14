export default function FeatureCard({ image, title, description }) {
    return (
      <div className="bg-white cursor-pointer hover:scale-105 duration-200 rounded-xl shadow-md p-6 flex flex-col items-left text-left">
        <img  src={image} alt={title} className="w-16 h-16 bg-white mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  }
  




//   const handleUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     setLoading(true); // Start loading

//     try {
//         const res = await fetch("https://shopmanagerback.onrender.com/api/upload/upload-file", {
//             method: "POST",
//             body: formData,
//         });

//         if (!res.ok) {
//             const errorData = await res.json();
//             console.error("Upload error:", errorData.error);
//             toast.error("Image upload failed ❌");
//             setLoading(false);
//             return;
//         }

//         const data = await res.json();
//         setUrl(data.url);
//         toast.success("Image uploaded ✅");
//     } catch (err) {
//         console.error("❌ Upload failed:", err.message);
//         toast.error("Image upload error");
//     } finally {
//         setLoading(false); // Stop loading
//     }
// };