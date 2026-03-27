export const serverConfig = () => ({
  port: Number(process.env.API_PORT),
  environment: process.env.NODE_ENV,
});
