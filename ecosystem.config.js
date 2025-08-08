module.exports = {
  apps: [
    {
      name: 'vtopup-app',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced PM2 features
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      
      // Monitoring
      monitoring: false,
      
      // Auto restart
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: 'vtopup-worker',
      script: 'worker.js',
      instances: 2,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'background'
      },
      cron_restart: '0 0 * * *', // Restart daily at midnight
      autorestart: true,
      watch: false
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/vtopup.git',
      path: '/var/www/vtopup',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
