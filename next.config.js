module.exports = {
  images: {
    domains: [
      "www.notion.so",
      "lh5.googleusercontent.com",
      "lh3.googleusercontent.com",
      "s3-us-west-2.amazonaws.com",
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    })
    return config
  },
}
