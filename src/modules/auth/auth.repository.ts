import { AbstractRepository } from 'src/core/database/database.absract';
import { apiKeys } from 'src/core/database/models/models';

export class AuthRepository extends AbstractRepository<typeof apiKeys> {
  protected tableName = apiKeys;
  protected modelName = 'API Key';

  async createApiKey(userEmail: string, hashedKey: string) {
    const [result] = await this.db
      .insert(apiKeys)
      .values({ userEmail, key: hashedKey })
      .returning({
        id: apiKeys.id,
        userEmail: apiKeys.userEmail,
        createdAt: apiKeys.createdAt,
      });

    return result;
  }
}
