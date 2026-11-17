/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Static export friendly; images are pre-resized in public/images.
    unoptimized: true,
  },
}

export default nextConfig
