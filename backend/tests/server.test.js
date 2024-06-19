const request = require('supertest');
const server = require('../server'); // Caminho para o arquivo do servidor

describe('Testes básicos do servidor', () => {
  afterAll(async () => {
    // Fechar o servidor após os testes
    await server.close();
  });

  it('Deve responder com status 200 na raiz', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
  });

  it('Deve redirecionar para a página de login na raiz', async () => {
    const response = await request(server).get('/');
    expect(response.text).toContain('login.html');
  });

  it('Deve responder com status 404 em uma rota inexistente', async () => {
    const response = await request(server).get('/rota-inexistente');
    expect(response.status).toBe(404);
  });
});
