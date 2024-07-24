const dbpool = require('../database')

class Group {
  constructor({ groupname, username }) {
    this.groupname = groupname
    this.username = username
  }

  async getAllGroups() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err)
          reject(err)
          return
        }
        connection.query(
          `SELECT DISTINCT groupname FROM usergroup WHERE groupname IS NOT NULL AND groupname != ''`,
          (err, results) => {
            connection.release()
            if (err) {
              console.error('Error executing query:', err)
              reject(err)
              return
            }
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
          reject(new Error('Database connection failed'))
        }
        const { groupname } = this
        const sql = 'INSERT INTO usergroup (groupname) VALUES (?)'
        const values = [groupname.toLowerCase()]

        connection.query(sql, values, (err, results) => {
          connection.release()

          if (err) {
            reject(err)
            return
          }
          resolve(results)
          return
        })
      })
    })
  }

  async getGroupByUsername() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err)
          reject(err)
          return
        }
        const { username } = this
        const sql = `SELECT * from usergroup where username = ?`
        const values = [username]
        console.log('username group.js')
        console.log(username)

        connection.query(sql, values, (err, results) => {
          connection.release()
          if (err) {
            console.error('Error executing query:', err)
            reject(err)
            return
          }
          console.log(results)
          resolve(results)
        })
      })
    })
  }

  async addUserGroup() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.log(err)
          reject('Database connection failed')
          return
        }
        const { groupname, username } = this
        const selectSql =
          'SELECT COUNT(*) AS count FROM usergroup WHERE groupname = ? AND username = ?'
        const selectValues = [groupname.toLowerCase(), username.toLowerCase()]

        connection.query(selectSql, selectValues, (err, results) => {
          if (err) {
            connection.release()
            reject(err)
            return
          }

          const count = results[0].count
          if (count > 0) {
            connection.release()
            reject('Combination already exists in usergroup')
            return
          }
          const insertSql =
            'INSERT INTO usergroup (groupname, username) VALUES (?, ?)'
          const insertValues = [groupname.toLowerCase(), username.toLowerCase()]

          connection.query(insertSql, insertValues, (err, results) => {
            connection.release()
            if (err) {
              reject(err)
              return
            }
            resolve(results)
          })
        })
      })
    })
  }

  async removeUserGroup() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        const { groupname, username } = this
        console.log('this')
        console.log(this)
        console.log(groupname, username)
        const sql = `delete from usergroup where groupname=? and username=? ;`
        const values = [groupname.toLowerCase(), username.toLowerCase()]

        connection.query(sql, values, (err, results) => {
          if (err) {
            connection.release()
            reject(err)
            return
          }
          console.log(results)
        })
      })
    })
  }
}

module.exports = Group
