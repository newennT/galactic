const users = [
    {
        id_user: 1,
        username: "superadmin",
        email: "admin@example.com",
        password: "bcrypt",
        is_admin: true,
        last_login: new Date(),
    },
    {
        id_user: 2,
        username: "user2",
        email: "user@example.com",
        password: "bcrypt",
        is_admin: false,
        last_login: new Date(),
    }
]

module.exports = users;