import { TPostsList } from '@domain/posts/schemas/PostsList';

export interface IPostsDatasource {
  getPosts(): Promise<TPostsList>;
}
