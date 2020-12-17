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
        const expected = { id: expect.any(Number), url: 'https://ex.ex', title: 'Example' }
        expect(response.body).toEqual(expected);
        done();
      })
      .catch(done);
  });

  describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) => connection.query(
      'TRUNCATE bookmark', () => connection.query(
        'INSERT INTO bookmark SET ?', testBookmark, done
      )
    ));

    it('get id failed', () => {
      request(app)

        .get('/bookmarks/3')

        .expect(404)

        .expect('Content-Type', /json/)

        .then(response => {

          const expected = { error: 'Bookmark not found' }

          expect(response.body).toEqual(expected);

          done();

        });
    })

  });
  describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) => connection.query(
      'TRUNCATE bookmark', () => connection.query(
        'INSERT INTO bookmark SET ?', testBookmark, done
      )
    ));
  });

  it('get id success', () => {
    request(app)

      .get('/bookmarks/1')

      .expect(200)

      .expect('Content-Type', /json/)

      .then(response => {

        const expected = { id: 1, url: 'https://nodejs.org/', title: 'Node.js' }

        expect(response.body).toEqual(expected);

        done();

      });
  })
});

