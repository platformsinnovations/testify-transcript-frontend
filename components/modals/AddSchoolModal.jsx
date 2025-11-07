import { useState } from "react";
import Button from "@/components/ui/Button";

const AddSchoolModal = ({ isOpen, onClose, onSubmit }) => {
  const commonInputClasses =
    "w-full p-2 border border-gray-200 rounded text-black placeholder-gray-300";

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    subdomain: "",
    logo_url: "",
    brand_color: "#00D100",
    admin_name: "",
    admin_email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      await onSubmit(formData);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      }
    }
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
      <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-tms-text">
            Add New School
          </h2>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-tms-text mb-1">
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
              <label className="block text-sm font-medium text-tms-text mb-1">
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
              <label className="block text-sm font-medium text-tms-text mb-1">
                Subdomain
              </label>
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                className={`${commonInputClasses} ${errors.subdomain ? 'border-red-500' : ''}`}
                placeholder="https://school.domain.com"
                required
              />
              {errors.subdomain && (
                <p className="text-red-500 text-sm mt-1">{errors.subdomain[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-tms-text mb-1">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Admin Name
              </label>
              <input
                type="text"
                name="admin_name"
                value={formData.admin_name}
                onChange={handleChange}
                className={commonInputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Admin Email
              </label>
              <input
                type="email"
                name="admin_email"
                value={formData.admin_email}
                onChange={handleChange}
                className={`${commonInputClasses} ${errors.admin_email ? 'border-red-500' : ''}`}
                required
              />
              {errors.admin_email && (
                <p className="text-red-500 text-sm mt-1">{errors.admin_email[0]}</p>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-6">
            <div className="w-48">
              <label className="block text-sm font-medium text-tms-text mb-1">
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
                  className={`${commonInputClasses} w-32`}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              {/* <Button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded"
              >
                Cancel
              </Button> */}
              <Button
                type="submit"
                className="px-4 py-2 bg-tms-lightGreen text-white rounded hover:bg-green-600"
              >
                Add School
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchoolModal;
