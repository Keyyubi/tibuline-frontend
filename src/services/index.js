import './UserService'

export const $api = {
  users: new UsersService(),
  posts: new PostsService(),
  albums: new AlbumsService()
};
