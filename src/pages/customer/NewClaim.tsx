import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, X, FileText, Package, Truck, PencilLine } from 'lucide-react';
import Header from '../../components/Header';

interface FormData {
  policyId: string;
  type: 'shipping' | 'product' | 'both';
  description: string;
  evidence: string[];
}

interface FileUploadProgress {
  id: string;
  file: File;
  progress: number; // 0-100
  status: 'uploading' | 'complete' | 'error';
  previewUrl?: string;
  url?: string;
}

const NewClaim: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    policyId: '',
    type: 'shipping',
    description: '',
    evidence: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Create file previews and add them to the upload progress
    const newFiles = Array.from(files).map(file => {
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);

      return {
        id,
        file,
        progress: 0,
        status: 'uploading' as const,
        previewUrl
      };
    });

    setUploadProgress(prev => [...prev, ...newFiles]);

    // Upload each file individually with progress tracking
    for (const fileInfo of newFiles) {
      try {
        const formData = new FormData();
        formData.append('file', fileInfo.file);

        // Use XMLHttpRequest to track upload progress
        await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(prev =>
                prev.map(item =>
                  item.id === fileInfo.id
                    ? { ...item, progress: percentComplete }
                    : item
                )
              );
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.url);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
          });

          xhr.open('POST', '/api/claims/upload');
          xhr.send(formData);
        }).then((url) => {
          // Update the uploadProgress state with the completed status and URL
          setUploadProgress(prev =>
            prev.map(item =>
              item.id === fileInfo.id
                ? { ...item, status: 'complete', url, progress: 100 }
                : item
            )
          );

          // Add the URL to the form data
          setFormData(prev => ({
            ...prev,
            evidence: [...prev.evidence, url]
          }));
        });
      } catch (error) {
        setUploadProgress(prev =>
          prev.map(item =>
            item.id === fileInfo.id
              ? { ...item, status: 'error', progress: 0 }
              : item
          )
        );
        setError('Failed to upload files. Please try again.');
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Filter for image files only
      const files = e.dataTransfer.files;
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        // Create a file list-like object
        const fileList = new DataTransfer();
        imageFiles.forEach(file => fileList.items.add(file));

        // Use our handleFileUpload function directly with the filelist
        handleFileUpload({
          target: {
            files: fileList.files
          }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Release any object URLs when component unmounts
      uploadProgress.forEach(item => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [uploadProgress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="tw-min-h-screen tw-bg-gray-50"
    >
      <Header isStorefront={false} />

      <main className="tw-container tw-mx-auto tw-px-4 tw-py-8 md:tw-py-12">
        <div className="tw-max-w-2xl tw-mx-auto">
          <div className="tw-text-center tw-mb-8">
            <h1 className="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-gray-900">File a New Claim</h1>
            <p className="tw-text-gray-600 tw-mt-2 tw-max-w-md tw-mx-auto">We're here to help resolve your issue quickly and efficiently</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="tw-mb-6 tw-p-4 tw-bg-rose-50 tw-border tw-border-rose-200 tw-rounded-lg tw-flex tw-items-center tw-text-rose-700 tw-shadow-sm"
            >
              <AlertCircle className="tw-h-5 tw-w-5 tw-mr-3 tw-flex-shrink-0" />
              <span className="tw-text-sm tw-font-medium">{error}</span>
            </motion.div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tw-bg-white tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200 tw-p-8 tw-text-center"
            >
              <div className="tw-w-16 tw-h-16 tw-bg-emerald-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
                <FileText className="tw-h-8 tw-w-8 tw-text-emerald-600" />
              </div>
              <h2 className="tw-text-xl tw-font-semibold tw-text-gray-900 tw-mb-2">Claim Submitted Successfully!</h2>
              <p className="tw-text-gray-600 tw-mb-6 tw-max-w-md tw-mx-auto">We'll review your claim and get back to you within 1-2 business days.</p>
              <button
                onClick={() => window.location.reload()}
                className="tw-inline-flex tw-items-center tw-justify-center tw-px-5 tw-py-2 tw-border tw-border-transparent tw-rounded-lg tw-text-sm tw-font-medium tw-text-white tw-bg-protega-600 hover:tw-bg-protega-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-protega-500 tw-transition-colors tw-duration-150"
              >
                Submit Another Claim
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="tw-space-y-6">
              <div className="tw-bg-white tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200 tw-overflow-hidden">
                <div className="tw-px-6 tw-py-4 tw-bg-gray-50 tw-border-b tw-border-gray-200">
                  <h2 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-flex tw-items-center">
                    <PencilLine className="tw-h-5 tw-w-5 tw-mr-2 tw-text-protega-600" />
                    Claim Details
                  </h2>
                </div>
                <div className="tw-p-6 tw-space-y-6">
                  <div className="tw-space-y-1">
                    <label htmlFor="policyId" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Policy ID <span className="tw-text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="policyId"
                      value={formData.policyId}
                      onChange={(e) => setFormData(prev => ({ ...prev, policyId: e.target.value }))}
                      className="tw-mt-1 tw-block tw-w-full tw-px-3 tw-py-2 tw-bg-white tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-protega-600/20 focus:tw-border-protega-600 sm:tw-text-sm tw-transition-colors tw-duration-150"
                      required
                      placeholder="Enter your policy ID"
                    />
                    <p className="tw-text-xs tw-text-gray-500 tw-mt-1">Your policy ID is located on your purchase receipt</p>
                  </div>

                  <div className="tw-space-y-1">
                    <label htmlFor="type" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Claim Type <span className="tw-text-rose-500">*</span>
                    </label>
                    <div className="tw-mt-1 tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3">
                      {[
                        { value: 'shipping', label: 'Shipping Issue', icon: Truck },
                        { value: 'product', label: 'Product Issue', icon: Package },
                        { value: 'both', label: 'Both Issues', icon: FileText }
                      ].map(({ value, label, icon: Icon }) => (
                        <label
                          key={value}
                          className={`
                            tw-relative tw-flex tw-cursor-pointer tw-rounded-lg tw-border tw-p-4 focus:tw-outline-none tw-transition-all tw-duration-150
                            ${formData.type === value
                              ? 'tw-border-protega-600 tw-ring-2 tw-ring-protega-600/20 tw-bg-protega-50/50'
                              : 'tw-border-gray-200 hover:tw-border-gray-300 hover:tw-bg-gray-50'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={value}
                            checked={formData.type === value}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as FormData['type'] }))}
                            className="tw-sr-only"
                          />
                          <div className="tw-flex tw-flex-col tw-items-center tw-flex-1">
                            <Icon className={`h-5 w-5 ${formData.type === value ? 'text-protega-600' : 'text-gray-400'} transition-colors duration-150`} />
                            <span className={`mt-2 text-sm ${formData.type === value ? 'text-protega-900 font-medium' : 'text-gray-900'} transition-colors duration-150`}>
                              {label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="tw-space-y-1">
                    <label htmlFor="description" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Description <span className="tw-text-rose-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="tw-mt-1 tw-block tw-w-full tw-px-3 tw-py-2 tw-bg-white tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-protega-600/20 focus:tw-border-protega-600 sm:tw-text-sm tw-transition-colors tw-duration-150"
                      required
                      placeholder="Please provide details about your claim..."
                    />
                    <p className="tw-text-xs tw-text-gray-500 tw-mt-1">Be as specific as possible to help us process your claim faster</p>
                  </div>

                  <div className="tw-space-y-1">
                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Evidence <span className="tw-text-xs tw-font-normal tw-text-gray-500">(Optional)</span>
                    </label>
                    <div
                      className={`
                        tw-mt-1 tw-flex tw-justify-center tw-px-6 tw-pt-5 tw-pb-6 tw-border-2 tw-border-dashed tw-rounded-lg tw-transition-colors tw-duration-150
                        ${
                          dragActive
                            ? 'tw-border-protega-600 tw-bg-protega-50/50'
                            : 'tw-border-gray-300 hover:tw-border-gray-400 hover:tw-bg-gray-50/50'
                        }
                      `}
                      
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="tw-space-y-2 tw-text-center">
                        <Upload className="tw-mx-auto tw-h-12 tw-w-12 tw-text-gray-400" />
                        <div className="tw-flex tw-flex-wrap tw-justify-center tw-text-sm tw-text-gray-600">
                          <label className="tw-relative tw-cursor-pointer tw-rounded-md tw-font-medium tw-text-protega-600 hover:tw-text-protega-700 tw-focus-within:outline-none tw-focus-within:ring-2 tw-focus-within:ring-offset-2 tw-focus-within:ring-protega-500 tw-transition-colors tw-duration-150">
                            <span>Upload files</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              className="tw-sr-only"
                              accept="image/*"
                            />
                          </label>
                          <p className="tw-pl-1">or drag and drop</p>
                        </div>
                        <p className="tw-text-xs tw-text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>

                    {uploadProgress.length > 0 && (
                      <div className="tw-mt-4 tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-4">
                        {uploadProgress.map((item) => (
                          <div key={item.id} className="tw-relative tw-group">
                            <div className="tw-aspect-video tw-rounded-lg tw-overflow-hidden tw-bg-gray-100 tw-border tw-border-gray-200 tw-transition-all tw-duration-200 group-hover:tw-shadow-md">
                              {item.previewUrl && (
                                <img
                                  src={item.previewUrl}
                                  alt={`Upload ${item.file.name}`}
                                  className="tw-w-full tw-h-full tw-tw-object-cover tw-transition-transform tw-duration-200 group-hover:tw-scale-105"
                                  onLoad={(e) => {
                                    // Ensure the image is shown with proper dimensions
                                    const img = e.target as HTMLImageElement;
                                    if (img.naturalWidth > img.naturalHeight) {
                                      img.classList.remove('tw-object-cover');
                                      img.classList.add('tw-object-contain');
                                    }
                                  }}
                                  onError={() => {
                                    // If image fails to load, we don't need to do anything special
                                    // as the error state is already handled by the upload process
                                  }}
                                />
                              )}

                              {!item.previewUrl && (
                                <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-bg-gray-100">
                                  <div className="tw-w-8 tw-h-8 tw-border-2 tw-border-gray-300 tw-border-t-transparent tw-rounded-full tw-animate-spin" />
                                </div>
                              )}

                              {/* Progress overlay */}
                              {item.status === 'uploading' && (
                                <div className="tw-absolute tw-inset-0 tw-bg-black tw-bg-opacity-40 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white">
                                  <div className="tw-w-full tw-max-w-[80%] tw-h-2 tw-bg-white tw-bg-opacity-30 tw-rounded-full tw-overflow-hidden">
                                    <div
                                      className="tw-h-full tw-bg-white tw-rounded-full tw-transition-all tw-duration-300 tw-ease-out"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                  <span className="tw-text-xs tw-mt-2">{item.progress}%</span>
                                </div>
                              )}

                              {/* Error state */}
                              {item.status === 'error' && (
                                <div className="tw-absolute tw-inset-0 tw-bg-rose-500 tw-bg-opacity-40 tw-flex tw-items-center tw-justify-center tw-text-white">
                                  <span className="tw-text-xs tw-font-medium">Upload Failed</span>
                                </div>
                              )}
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (item.status === 'complete' && item.url) {
                                  // Remove from form data if upload was completed
                                  setFormData(prev => ({
                                    ...prev,
                                    evidence: prev.evidence.filter(url => url !== item.url)
                                  }));
                                }

                                // Remove from upload progress
                                setUploadProgress(prev =>
                                  prev.filter(file => file.id !== item.id)
                                );

                                // Release object URL
                                if (item.previewUrl) {
                                  URL.revokeObjectURL(item.previewUrl);
                                }
                              }}
                              className="tw-absolute tw--top-2 tw--right-2 tw-p-1 tw-bg-white tw-rounded-full tw-shadow-sm tw-border tw-border-gray-200 tw-text-gray-400 hover:tw-text-gray-500 tw-transition-colors tw-duration-150"
                              aria-label="Remove image"
                            >
                              <X className="tw-h-4 tw-w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.evidence.length > 0 && formData.evidence.filter(url =>
                      !uploadProgress.some(item => item.url === url)
                    ).length > 0 && (
                        <div className="tw-mt-4 tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-4">
                          {formData.evidence.filter(url =>
                            !uploadProgress.some(item => item.url === url)
                          ).map((url, index) => (
                            <div key={`existing-${index}`} className="tw-relative tw-group">
                              <div className="tw-aspect-video tw-rounded-lg tw-overflow-hidden tw-transition-all tw-duration-200 group-hover:tw-shadow-md">
                                <img
                                  src={url}
                                  alt={`Evidence ${index + 1}`}
                                  className="tw-w-full tw-h-full tw-tw-object-cover tw-transition-transform tw-duration-200 group-hover:tw-scale-105"
                                  onLoad={(e) => {
                                    // Ensure the image is shown with proper dimensions
                                    const img = e.target as HTMLImageElement;
                                    if (img.naturalWidth > img.naturalHeight) {
                                      img.classList.remove('tw-object-cover');
                                      img.classList.add('tw-object-contain');
                                    }
                                  }}
                                  onError={(e) => {
                                    // If image fails to load, show a placeholder
                                    const img = e.target as HTMLImageElement;
                                    img.onerror = null; // Prevent infinite loop
                                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTMgM0gxMUwxMSAxMUgzVjEzSDExVjIxSDEzVjEzSDIxVjExSDEzVjNaIiBmaWxsPSIjOTlBM0FCIi8+PC9zdmc+';
                                    img.classList.add('tw-p-8', 'tw-opacity-30');
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  evidence: prev.evidence.filter(u => u !== url)
                                }))}
                                className="tw-absolute tw--top-2 tw--right-2 tw-p-1 tw-bg-white tw-rounded-full tw-shadow-sm tw-border tw-border-gray-200 tw-text-gray-400 hover:tw-text-gray-500 tw-transition-colors tw-duration-150"
                                aria-label="Remove image"
                              >
                                <X className="tw-h-4 tw-w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    <p className="tw-text-xs tw-text-gray-500 tw-mt-2">Upload photos related to your claim to help us process it faster.</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="tw-w-full tw-flex tw-justify-center tw-py-3 tw-px-4 tw-border tw-border-transparent tw-rounded-lg tw-shadow-md tw-text-sm tw-font-medium tw-text-white tw-bg-protega-600 hover:tw-bg-protega-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-protega-500 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-all tw-duration-150"
              >
                {isSubmitting ? (
                  <div className="tw-flex tw-items-center">
                    <div className="tw-w-5 tw-h-5 tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-animate-spin tw-mr-2" />
                    Submitting Claim...
                  </div>
                ) : (
                  'Submit Claim'
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default NewClaim;