import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDBContainer } from 'src/test-utils/test.utils';
import * as request from 'supertest';
import { DatabaseService } from 'src/core/database/database.service';
import { AppModule } from 'src/modules/app/app.module';
import { sql } from 'drizzle-orm';
import { posts } from 'src/core/database/models/models';
import { Post, PostCreateInput } from 'src/modules/posts/dtos/posts.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { DATABASE_CONNECTION } from 'src/core/database/connection/connection.provider';

const postStub = (): PostCreateInput => {
  return {
    title: 'First post',
    body: 'This is the first post',
  };
};

const postVerifier = {
  ...postStub(),
  id: expect.any(Number),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
} satisfies Post;

describe('Posts (E2E)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;
  let httpServer: ReturnType<INestApplication['getHttpServer']>;
  let mockDatabaseService: DatabaseService;
  let mockDb: TestDBContainer;

  beforeAll(async () => {
    mockDb = new TestDBContainer();

    const mockDatabaseConnection = await mockDb.getPool();

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE_CONNECTION)
      .useValue(mockDatabaseConnection)

      .overrideGuard(AuthGuard)
      .useValue(jest.fn())

      .compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();

    mockDatabaseService = app.get<DatabaseService>(DatabaseService);

    await app.init();
  });

  beforeEach(async () => {
    sql.raw(`TRUNCATE TABLE "posts" RESTART IDENTITY`);

    await mockDatabaseService.insert(posts).values(postStub()).execute();
  });

  afterAll(async () => {
    const pool = await mockDb.getPool();

    await Promise.all([pool.end(), app.close()]);
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const response = await request(httpServer).get('/posts').expect(200);

      expect(response.body).toEqual([postVerifier]);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a post', async () => {
      const response = await request(httpServer).get('/posts/1').expect(200);

      expect(response.body).toEqual(postVerifier);
    });
  });

  describe('POST /posts', () => {
    it('should create a post', async () => {
      const response = await request(httpServer)
        .post('/posts')
        .send(postStub())
        .expect(201);

      expect(response.body).toEqual(postVerifier);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      const response = await request(httpServer).delete('/posts/1').expect(200);

      expect(response.body).toEqual({ id: 1 });
    });
  });
});
