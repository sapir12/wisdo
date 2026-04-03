import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app, loginAndGetToken, resetDatabase, setupTestDatabase, teardownTestDatabase } from './helpers';
import { BookModel } from '../src/models/book.model';

describe('Feed API', () => {
  before(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it('returns only accessible books and prioritizes same-country authors', async () => {
    const aggregateSpy = sinon.spy(BookModel, 'aggregate');
    const token = await loginAndGetToken('admin', 'password123');

    const response = await request(app)
      .get('/feed')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array').with.length(3);
    expect(response.body[0].authorCountry).to.equal('US');
    expect(response.body[0].title).to.equal('Distributed Systems in Practice');
    expect(response.body[1].authorCountry).to.equal('US');
    expect(response.body[2].title).to.equal('Modern API Design');
    expect(aggregateSpy.calledOnce).to.equal(true);
  });

  it('returns an empty array when no books exist in the user libraries', async () => {
    await BookModel.deleteMany({});
    const token = await loginAndGetToken('admin', 'password123');

    const response = await request(app)
      .get('/feed')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([]);
  });
});
