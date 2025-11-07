import Button from '@/components/ui/Button';
import Image from 'next/image';

const ViewSchoolModal = ({ isOpen, onClose, school }) => {
  if (!isOpen || !school) return null;

  // HANDLE IMAGE URL BASED ON ITS TYPE
  const getDirectImageUrl = (url) => {
    if (!url) return null;
    console.log('Processing URL:', url);

    try {
      // If it's already a relative URL starting with '/', return as is
      if (url.startsWith('/')) {
        return url;
      }

      // HANDLE SUBDOMAIN URLS THAT ARE JUST DOMAIN PATHS 
      // (This prevents the component from trying to show a non-image string (the subdomain) as if it were a logo URL.)
      if (url === school.subdomain) {
        console.log('URL is same as subdomain, skipping');
        return '/universityTranscript/testifyIconLogin.svg';
      }

      // CREATE URL OBJECT TO VALIDATE AND PARSE THE URL
      const parsedUrl = new URL(url);
      
      // HANDLE GoogleDrive URLs
      if (parsedUrl.hostname === 'drive.google.com') {
        const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1];
        if (fileId) {
          const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          console.log('Converted Google Drive URL:', directUrl);
          return directUrl;
        }
      }

      // FOR IMAGE URLS, ENSURE THEY HAVE A PROPER IMAGE EXTENSION
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
      const hasImageExtension = imageExtensions.some(ext => 
        parsedUrl.pathname.toLowerCase().endsWith(ext)
      );

      if (hasImageExtension) {
        console.log('Valid image URL:', url);
        return url;
      } else {
        console.log('URL does not end with image extension:', url);
        return '/universityTranscript/testifyIconLogin.svg';
      }
    } catch (error) {
      console.warn('Invalid URL:', url, error);
      return '/universityTranscript/testifyIconLogin.svg';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1000">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      <div className="bg-white rounded-2xl w-[773px] max-h-[90vh] overflow-y-auto relative z-1001 shadow-xl">
        <div className="p">
          <div className="flex justify-between bg-tms-lightGreen items-center p-6 mb-">
            <h2 className="text-2xl font-bold text-white">School Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
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

          <div className="p-6">
            <div className="bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-tms-text">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-1">
                  <p className="text-sm text-tms-gray-20">School Name</p>
                  <p className="text-md font-semibold text-tms-admin">{school.name}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-tms-gray-20">Subdomain</p>
                  <p className="text-md font-semibold text-tms-admin">{school.subdomain}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-tms-gray-20">Reference</p>
                  <p className="text-md font-semibold text-tms-admin">{school.reference}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-tms-gray-20">Status</p>
                  <p className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                    school.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.status === 1 ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-tms-text">
                Contact & Brand Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-tms-gray-20">Address</p>
                  <p className="text-md font-semibold text-tms-admin">{school.address}</p>
                </div>
                <div>
                  <p className="text-sm text-tms-gray-20">Brand Color</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: school.brandColor }}
                    />
                    <p className="text-md font-semibold text-tms-admin">{school.brandColor}</p>
                  </div>
                </div>
              </div>

              {school.logoUrl && (
                <div className="mt-4">
                  <p className="text-sm text-tms-gray-20 mb-2">School Logo</p>
                  <div className="relative w-[200px] h-[100px]">
                    <Image
                      key={school.logoUrl}
                      src={getDirectImageUrl(school.logoUrl)}
                      alt={`${school.name} logo`}
                      fill
                      className="rounded border border-gray-50"
                      style={{ objectFit: 'contain' }}
                      onError={(e) => {
                        console.warn(`Failed to load logo for ${school.name}:`, school.logoUrl);
                        const fallbackUrl = '/universityTranscript/testifyIconLogin.svg';
                        if (e.target.src !== fallbackUrl) {
                          e.target.onerror = null;
                          // Using Next.js Image, we need to update the src prop
                          e.currentTarget.src = fallbackUrl;
                          console.log('Falling back to default logo');
                        }
                      }}
                      sizes="200px"
                      quality={75}
                      priority={true}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-tms-text">
                Timestamps
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-tms-gray-20">Created At</p>
                  <p className="text-md font-semibold text-tms-admin">
                    {new Date(school.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-tms-gray-20">Last Updated</p>
                  <p className="text-md font-semibold text-tms-admin">
                    {new Date(school.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSchoolModal;