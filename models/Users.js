const dbpool = require('../database')

class User {
  constructor({ username, password, email, disabled }) {
    this.username = username
    this.password = password
    this.email = email
    this.disabled = disabled
  }

  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err)
          reject(err)
          return
        }
        connection.query(
          'SELECT u.*, GROUP_CONCAT(ug.groupname) AS groupnames FROM user u LEFT JOIN usergroup ug ON u.username = ug.username GROUP BY u.username',
          (err, results) => {
            connection.release()
            if (err) {
              console.error('Error executing query:', err)
              reject(err)
              return
            }
            results.forEach(user => {
              if (user.groupnames) {
                user.groupnames = user.groupnames.split(',')
              } else {
                user.groupnames = [] // Handle case where user has no groups
              }
            })
            resolve(results)
          }
        )
      })
    })
  }

  async save() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err)
          reject(err)
          return
        }

        const { username, email, password, disabled } = this
        const sql =
          'INSERT INTO user (username, email, password, disabled) VALUES (?, ?, ?, ?)'
        const values = [username.toLowerCase(), email, password, disabled]

        connection.query(sql, values, (err, results) => {
          connection.release()

          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              reject('Duplicate username, username already exists in db')
            }
            console.error('Error executing query:', err)
            reject(err)
            return
          }
          resolve(results)
        })
      })
    })
  }

  async getByUsername() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err)
          reject(err)
          return
        }
        const { username } = this
        const sql = `SELECT u.*, GROUP_CONCAT(ug.groupname) AS groupnames FROM user u LEFT JOIN usergroup ug ON u.username = ug.username WHERE u.username = ? GROUP BY u.username`
        const values = [username]
        console.log(username)

        connection.query(sql, values, (err, results) => {
          connection.release()
          if (err) {
            console.error('Error executing query:', err)
            reject(err)
            return
          }
          console.log(results)
          if (results.length > 0) {
            resolve(results[0])
          } else {
            reject('User not found')
          }
        })
      })
    })
  }

  static async updateEmail(username, email) {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err)
          reject(err)
          return
        }
        const sql = 'UPDATE user SET email = ? WHERE username = ?'
        const values = [email, username]

        connection.query(sql, values, (err, result) => {
          connection.release()
          if (err) {
            console.error('Error updating email:', err)
            reject(err)
            return
          }
          resolve(result.affectedRows)
        })
      })
    })
  }

  static async updatePassword(username, password) {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err)
          reject(err)
          return
        }
        const sql = 'UPDATE user SET password = ? WHERE username = ?'
        const values = [username, password]

        connection.query(sql, values, (err, result) => {
          connection.release()
          if (err) {
            console.error('Error updating password:', err)
            reject(err)
            return
          }
          resolve(result.affectedRows)
        })
      })
    })
  }

  async adminUpdateUser() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        const { username, email, password, disabled } = this

        const sql = `update user set email=?, password = ?, disabled=? where username=? ;`
        const values = [email, password, disabled, username]

        connection.query(sql, values, (err, results) => {
          connection.release()
          if (err) {
            console.error('Error executing query:', err)
            reject(err)
            return
          }
          resolve(results)
        })
      })
    })
  }
}

module.exports = User
