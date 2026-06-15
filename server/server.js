import env from './src/config/env.js';
import connectDB from './src/config/db.js';
import app from './src/app.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(env.PORT, () => {
      console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🚀 Server running in ${env.NODE_ENV} mode           ║
  ║   📍 http://localhost:${env.PORT}                     ║
  ║   🔗 API: http://localhost:${env.PORT}/api/health     ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error(`💥 Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`💥 Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();