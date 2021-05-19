const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.Server({
    port: 5000,
    host: 'localhost',
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
