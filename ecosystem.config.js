module.exports = {
  apps: [
    {
      name: "pro-housing-client",
      cwd: "./client",
      script: "node",
      args: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
        HOSTNAME: "localhost"
      },
    },
    {
      name: "pro-housing-server",
      cwd: "./server",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "4001"
      },
    },
  ],
};
