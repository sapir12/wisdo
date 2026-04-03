import { expect } from 'chai';
import request from 'supertest';
import { app, loginAndGetToken, resetDatabase, setupTestDatabase, teardownTestDatabase } from './helpers';

describe('Books API', () => {
  before(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it('creates a book in a library the user belongs to', async () => {
    const token = await loginAndGetToken('admin', 'password123');

    const response = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Node.js Patterns',
        author: 'Mario Casciaro',
        authorCountry: 'IT',
        publishedDate: '2020-01-01',
        pages: 526,
        library: '65f100000000000000000001',
      });

    expect(response.status).to.equal(201);
    expect(response.body.title).to.equal('Node.js Patterns');
    expect(response.body.library).to.equal('65f100000000000000000001');
  });

  it('returns 400 for invalid input when creating a book', async () => {
    const token = await loginAndGetToken('admin', 'password123');

    const response = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        author: 'Unknown',
        authorCountry: 'US',
        publishedDate: '2020-01-01',
        pages: 0,
        library: '65f100000000000000000001',
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Validation failed');
  });

  it('returns 403 when creating a book in a library the user does not belong to', async () => {
    const token = await loginAndGetToken('reader_uk', 'password123');

    const response = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Forbidden Book',
        author: 'Unknown',
        authorCountry: 'US',
        publishedDate: '2020-01-01',
        pages: 100,
        library: '65f100000000000000000001',
      });

    expect(response.status).to.equal(403);
    expect(response.body.message).to.equal('You do not have access to this library');
  });
});
