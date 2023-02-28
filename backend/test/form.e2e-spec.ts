import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initializeApp } from './utils';

describe('FormController (e2e)', () => {
  //? Id and maybe even entire db objects seem to persist across test runs and thing about pdfLink?
  //? found that by adding --no-cache to test:e2e gets rid of open handles warning but jest says: https://jestjs.io/docs/cli#--cache idk is it worth it?
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    app = await initializeApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    server.close();
  });

  describe('all tests for /forms (POST)', () => {
    it('should return 201 if form successfully created', () => {
      return request(server)
        .post('/forms')
        .send({
          name: 'test1',
          pdfLink: 'https://www.sandboxnu.com/',
        })
        .expect(201);
    });

    it('should return the expected body', () => {
      return request(server)
        .post('/forms')
        .send({
          name: 'test2',
          pdfLink: 'https://www.sandboxnu.com/',
        })
        .expect(201)
        .then((res) => {
          const body = res.body;
          expect(body.id).toBeGreaterThanOrEqual(0);
          expect(body.name).toStrictEqual('test2');
          expect(body.signatureChainLinkHead).toBeNull();
          expect(body.signatureChainLinkHeadId).toBeNull();
          expect(body.formInstances).toStrictEqual([]);
        });
    });

    it('should fail if name is empty', () => {
      return request(server)
        .post('/forms')
        .send({
          name: '',
          pdfLink: 'https://www.sandboxnu.com/',
        })
        .expect(400);
    });

    it('should fail if name doesnt exist', () => {
      return request(server)
        .post('/forms')
        .send({
          pdfLink: 'https://www.sandboxnu.com/',
        })
        .expect(400);
    });

    it('should fail if invalid link', () => {
      return request(server)
        .post('/forms')
        .send({
          name: 'test',
          pdfLink: 'google',
        })
        .expect(400);
    });

    it('should fail if link is missing', () => {
      return request(server)
        .post('/forms')
        .send({
          name: 'test',
        })
        .expect(400);
    });
  });
});
