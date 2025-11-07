import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const EditSchoolModal = ({ isOpen, onClose, onSubmit, school }) => {
  const commonInputClasses =
    "w-full p-2 border border-gray-200 rounded-lg text-black placeholder-gray-300";

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    subdomain: "",
    logo_url: "",
    brand_color: "#00D100",
  });

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name,
        address: school.address,
        subdomain: school.subdomain,
        logo_url: school.logoUrl,
        brand_color: school.brandColor,
      });
    }
  }, [school]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      {/* <div className="relative bg-white rounded-2xl w-[773px] max-h-[90vh] overflow-y-auto z-51 shadow-lg p-6"> */}
      <div className="bg-white rounded-2xl w-[773px] max-h-[90vh] overflow-y-auto relative z-1001 shadow-xl">
        <div>
          <div className="flex justify-between bg-tms-lightGreen items-center p-6">
            <h2 className="text-2xl font-bold text-white">Edit School</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-10 py-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="text-lg font-semibold mb-4 text-tms-text"
              >
                School Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={commonInputClasses}
                required
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-4 text-tms-text">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={commonInputClasses}
                required
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-4 text-tms-text">
                Subdomain
              </label>
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                className={commonInputClasses}
                placeholder="https://school.domain.com"
                required
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-4 text-tms-text">
                Logo URL
              </label>
              <input
                type="url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                className={commonInputClasses}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-lg font-semibold mb-4 text-tms-text">
              Brand Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                name="brand_color"
                value={formData.brand_color}
                onChange={handleChange}
                className="w-12 h-12"
              />
              <input
                type="text"
                value={formData.brand_color}
                onChange={(e) =>
                  handleChange({
                    target: { name: "brand_color", value: e.target.value },
                  })
                }
                className={commonInputClasses}
                pattern="^#[0-9A-Fa-f]{6}$"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {/* <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tms-primary"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-tms-primary rounded-lg bg-tms-lightGreen hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tms-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSchoolModal;
