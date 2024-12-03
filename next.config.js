/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_APP_MODE === "staging" ? "/editor-stg" : "/editor";

const nextConfig = {
  basePath,
};

module.exports = nextConfig;
