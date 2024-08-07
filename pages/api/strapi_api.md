1. 注册
axios
  .post('http://localhost:1337/api/auth/local/register', {
    username: 'Strapi user',
    email: 'user@strapi.io',
    password: 'strapiPassword',
  })

2. login
axios
  .post('http://localhost:1337/api/auth/local', {
    identifier: 'user@strapi.io',
    password: 'strapiPassword',
  })


3. 带jwt的请求
axios
  .get('http://localhost:1337/posts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

4. forget password
axios
  .post('http://localhost:1337/api/auth/forgot-password', {
    email: 'user@strapi.io', // user's email
  })

5.reset password
// Request API.
axios.post(
  'http://localhost:1337/api/auth/change-password',
  {
    currentPassword: 'currentPassword',
    password: 'userNewPassword',
    passwordConfirmation: 'userNewPassword',
  },
  {
    headers: {
      Authorization: 'Bearer <user jwt>',
    },
  }
);

6. Email validation
axios
  .post(`http://localhost:1337/api/auth/send-email-confirmation`, {
    email: 'user@strapi.io', // user's email
  })



