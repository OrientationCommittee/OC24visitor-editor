/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_APP_MODE === "staging" ? "/24/editor-stg" : "/24/editor";

const nextConfig = {
  basePath,
};

module.exports = nextConfig;
