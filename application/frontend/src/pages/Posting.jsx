import React, { useState, useEffect } from 'react';

const Posting = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    product_desc: '',
    category: '',
  });

  const [photos, setPhotos] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://13.52.231.140:3001/api/search');
        const data = await res.json();
        const items = data.items || [];

        const uniqueCategories = Array.from(
          new Set(items.map((item) => item.category_name))
        ).map((name) => ({ category_name: name }));

        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviewURLs(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...previewURLs];

    URL.revokeObjectURL(newPreviews[index]);
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);

    setPhotos(newPhotos);
    setPreviewURLs(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isLoggedIn) {
      alert('You must be logged in to publish your product.');
      return;
    }

    const isEmpty =
      !formData.title || !formData.price || !formData.product_desc || !formData.category || photos.length === 0;

    if (isEmpty) return;

    try {
      const token = localStorage.getItem('token');

      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('price', formData.price);
      payload.append('product_desc', formData.product_desc);
      payload.append('category', formData.category);

      photos.forEach((photo) => {
        payload.append('photos', photo);
      });

      const res = await fetch('http://13.52.231.140:3001/api/listings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!res.ok) {
        throw new Error('Failed to submit listing');
      }

      alert('Listing created successfully!');

      // Confirm by fetching and logging the listing from the database
      const confirmRes = await fetch('http://13.52.231.140:3001/api/search');
      const confirmData = await confirmRes.json();
      const items = confirmData.items || [];

      const match = items.find(item => item.title === formData.title);
      if (match) {
        console.log('✅ Product successfully stored in the database:', match);
      } else {
        console.warn('⚠️ Product submission succeeded, but not found in /api/search response.');
      }

      // Reset form
      setFormData({ title: '', price: '', product_desc: '', category: '' });
      setPhotos([]);
      setPreviewURLs([]);
      setSubmitted(false);
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred while submitting the listing.');
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
        <h1 className="text-3xl font-bold mb-8 text-center">Posting product</h1>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Photos <span className="text-red-500">*</span>
          </label>

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
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={getInputClass('category')}
          >
            <option value="">Select a category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.category_name}>
                {cat.category_name}
              </option>
            ))}
          </select>
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
            name="product_desc"
            rows="5"
            value={formData.product_desc}
            onChange={handleChange}
            className={getInputClass('product_desc') + ' resize-none'}
            placeholder="Describe your item"
          />
          {submitted && !formData.product_desc && (
            <p className="text-red-500 text-sm mt-1">⚠️ Description is required.</p>
          )}
        </div>

        {/* Login warning */}
        {!isLoggedIn && (
          <p className="text-yellow-400 mb-4 text-center">
            You must be logged in to publish a product.
          </p>
        )}

        {/* Button */}
        <div className="flex justify-center">
          <button
            className={`${
              !isLoggedIn
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white font-semibold px-8 py-3 rounded-lg transition`}
            onClick={handleSubmit}
            disabled={!isLoggedIn}
          >
            Publish
          </button>
        </div>
      </section>
    </div>
  );
};

export default Posting;
