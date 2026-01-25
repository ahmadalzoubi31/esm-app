export const serverConfig = () => ({
  port: Number(process.env.PORT),
  environment: process.env.NODE_ENV,
});
