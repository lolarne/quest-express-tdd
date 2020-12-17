const request = require('supertest');
const app = require('../app');
const connection = require('../connection');


describe('Test routes', () => {
  beforeEach(done => connection.query('TRUNCATE bookmark', done));
  it('GET / sends "Hello World" as json', (done) => {

    request(app)

      .get('/')

      .expect(200)

      .expect('Content-Type', /json/)

      .then(response => {

        const expected = { message: 'Hello World!' };

        expect(response.body).toEqual(expected);

        done();

      });

  });

  it('error case', (done) => {
    request(app)
      .post('/bookmarks').send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { error: 'required field missing' };
        expect(response.body).toEqual(expected);
        done();
      });
  })

  it('success case', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ url: 'https://ex.ex', title: 'Example' })
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = {id:expect.any(Number), url: 'https://ex.ex', title: 'Example' }
        expect(response.body).toEqual(expected);
        done();
      })
      .catch(done);
  });
});