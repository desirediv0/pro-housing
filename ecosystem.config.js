module.exports = {
    apps: [
        {
            name: "pro-housing-client",
            cwd: "/root/pro-housing/client",
            script: "npm",
            args: 'start',
            env: {
                PORT: 3001,
                NODE_ENV: 'production'
            },
            error_file: "/root/.pm2/logs/pro-housing-client-error.log",
            out_file: "/root/.pm2/logs/pro-housing-client-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_memory_restart: "500M"
        },
        {
            name: "pro-housing-server",
            cwd: "/root/pro-housing/server",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 4001,
            },
            error_file: "/root/.pm2/logs/pro-housing-server-error.log",
            out_file: "/root/.pm2/logs/pro-housing-server-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_memory_restart: "500M"
        },
    ],
};