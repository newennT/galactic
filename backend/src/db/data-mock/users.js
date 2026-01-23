const users = [
    {
        pseudo: "admin",
        email: "admin@example.com",
        password_hash: "HASH_BCRYPT",
        is_admin: true,
        last_login: new Date(),
    },
    {
        pseudo: "user",
        email: "user@example.com",
        password_hash: "HASH_BCRYPT",
        is_admin: false,
        last_login: new Date(),
    }
]

module.exports = users;