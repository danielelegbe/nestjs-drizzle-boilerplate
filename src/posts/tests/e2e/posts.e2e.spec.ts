import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { sql } from 'kysely';
import { AppModule } from 'src/app.module';
import { KYSELY_SERVICE, KyselyService } from 'src/database/database.module';
import { Post } from 'src/database/zod-schema';
import { setupKyselyConnection } from 'src/utils/test.utils';
import * as request from 'supertest';

const postStub = () => {
  return {
    title: 'First post',
    body: 'This is the first post',
  } as Post;
};

describe('Posts (E2E)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;
  let db: KyselyService;
  let httpServer: ReturnType<INestApplication['getHttpServer']>;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(KYSELY_SERVICE)
      .useValue(await setupKyselyConnection())
      .compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();

    db = app.get<KyselyService>(KYSELY_SERVICE);
  });

  beforeEach(async () => {
    await sql<void>`TRUNCATE TABLE "posts" RESTART IDENTITY`.execute(db);

    await db.insertInto('posts').values(postStub()).execute();
  });

  afterAll(async () => {
    await Promise.all([db.destroy(), app.close()]);
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const response = await request(httpServer).get('/posts').expect(200);

      expect(response.body).toMatchObject([postStub()]);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a post', async () => {
      const response = await request(httpServer).get('/posts/1').expect(200);

      expect(response.body).toMatchObject(postStub());
    });
  });

  describe('POST /posts', () => {
    it('should create a post', async () => {
      const response = await request(httpServer)
        .post('/posts')
        .send(postStub())
        .expect(201);

      expect(response.body).toMatchObject(postStub());
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      const response = await request(httpServer).delete('/posts/1').expect(200);

      expect(response.body).toMatchObject({ id: 1 });
    });
  });
});
