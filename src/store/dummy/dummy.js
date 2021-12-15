/**
 * ROLE IDs
 * admin => 0
 * unit manager => 1
 * supplier => 2
 */
export const users = [
  {
    id: 0,
    firstName: 'Fatih',
    lastName: 'Cigeroglu',
    email: 'fcigeroglu@tibula.com.tr',
    password: '1234qwer',
    roleId: 2,
    isLogged: false,
  },
  {
    id: 1,
    firstName: 'Nazan',
    lastName: 'Yagan',
    email: 'nyagan@tibula.com.tr',
    password: '1234qwer',
    roleId: 2,
    isLogged: false,
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@customer.com',
    password: '12341234',
    roleId: 1,
    isLogged: false,
  },
  {
    id: 3,
    firstName: 'Test',
    lastName: 'User',
    email: 'a@a.com',
    password: 'Aa.12345',
    roleId: 0,
    isLogged: false,
  },
]
