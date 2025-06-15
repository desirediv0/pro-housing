module.exports = {
    apps: [
        {
            name: "pro-housing-client",
            cwd: "./client",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: "3001"
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
