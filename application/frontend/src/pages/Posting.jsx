import React, { useState } from 'react';

const Posting = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
  });

  const [photos, setPhotos] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewURLs(previews);
  };

  const removeImage = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...previewURLs];

    // Revoke object URL to free memory
    URL.revokeObjectURL(newPreviews[index]);

    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);

    setPhotos(newPhotos);
    setPreviewURLs(newPreviews);
  };

  const uploadImage = async (listingId) => {
    const formDataObj = new FormData();
    formDataObj.append("image", photos[0]); // Only the first photo is used for now

    try {
      const res = await fetch(`http://13.91.27.12:3001/api/listings/${listingId}/upload`, {
        method: "POST",
        body: formDataObj,
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Upload success:", data);
        alert("Listing and image uploaded successfully!");
      } else {
        console.error("Upload error:", data);
        alert("Image upload failed.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("An error occurred during image upload.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const isEmpty =
      !formData.title || !formData.price || !formData.description || !formData.category || photos.length === 0;

    if (!isEmpty) {
      try {
        const listingRes = await fetch("http://13.91.27.12:3001/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const listingData = await listingRes.json();

        if (listingRes.ok && listingData.listingId) {
          console.log("Created listing:", listingData);

          // 2. Upload image to your backend (AWS)
          await uploadImage(listingData.listingId);

          // 3. Add to external search API
          const searchRes = await fetch("http://13.52.231.140:3001/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: formData.title,
              price: formData.price,
              description: formData.description,
              category_name: formData.category,
              listingId: listingData.listingId,
            }),
          });

          const searchData = await searchRes.json();

          if (searchRes.ok) {
            console.log("Search index updated:", searchData);
          } else {
            console.error("Search index failed:", searchData);
            alert("Listing saved, but search index update failed.");
          }
        } else {
          console.error("Failed to create listing.");
          alert("Failed to create listing.");
        }
      } catch (err) {
        console.error("Error during submission:", err);
        alert("An error occurred while creating the listing.");
      }
    }
  };

  const getInputClass = (field) =>
    `w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none ${
      submitted && !formData[field] ? 'border-2 border-red-500' : 'border border-gray-600'
    }`;

  const getPhotoBoxClass = () =>
    `w-full h-40 border-2 rounded-lg flex items-center justify-center cursor-pointer transition ${
      submitted && photos.length === 0
        ? 'border-red-500 border-dashed'
        : 'border-gray-600 border-dashed hover:border-green-300'
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <section className="w-full max-w-2xl bg-gray-800 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Posting items</h1>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Photos <span className="text-red-500">*</span>
          </label>

          {/* Only show the upload box if no preview */}
          {previewURLs.length === 0 && (
            <label className={getPhotoBoxClass()}>
              <span className="text-4xl">＋</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}

          {submitted && photos.length === 0 && (
            <p className="text-red-500 text-sm mt-1">⚠️ Photo is required.</p>
          )}

          {previewURLs.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              {previewURLs.map((url, idx) => (
                <div key={idx} className="relative w-full">
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="w-full h-72 object-cover rounded-lg border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full px-3 py-1 text-sm hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={getInputClass('title')}
            placeholder="Enter item title"
          />
          {submitted && !formData.title && (
            <p className="text-red-500 text-sm mt-1">⚠️ Title is required.</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={getInputClass('category')}
            placeholder="Enter category name"
          />
          {submitted && !formData.category && (
            <p className="text-red-500 text-sm mt-1">⚠️ Category is required.</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={getInputClass('price')}
            placeholder="$0.00"
          />
          {submitted && !formData.price && (
            <p className="text-red-500 text-sm mt-1">⚠️ Price is required.</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className={getInputClass('description') + ' resize-none'}
            placeholder="Describe your item"
          />
          {submitted && !formData.description && (
            <p className="text-red-500 text-sm mt-1">⚠️ Description is required.</p>
          )}
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            className="bg-green-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-600 transition"
            onClick={handleSubmit}
          >
            Publish
          </button>
        </div>
      </section>
    </div>
  );
};

export default Posting;
