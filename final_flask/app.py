from flask import Flask, request, jsonify, render_template, redirect, url_for
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'team032-dbsystems'
app.config['MYSQL_DATABASE_DB'] = 'unirankdb'
app.config['MYSQL_DATABASE_HOST'] = '35.224.163.116'
mysql.init_app(app)

@app.route('/')
def index():
    return render_template('index.html', title='Add User')

@app.route('/success')
def success():
    return jsonify({'message': 'Added user successfully!'})

@app.route('/mark', methods=['POST'])
def mark():
    username = request.form['username']
    password = request.form['password']
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "INSERT INTO Users (Username, Password) VALUES (%s, %s)"
    cursor.execute(sql, (username, password))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('success'))

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Users")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

@app.route('/api/users/modify/<username>', methods=['POST'])
def modify_user(username):
    new_username = request.form['new_username']
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "UPDATE Users SET Username = %s WHERE Username = %s"
    cursor.execute(sql, (new_username, username))
    conn.commit()
    response = {'message': 'User record modified successfully'} if cursor.rowcount else {'message': 'User not found'}
    cursor.close()
    conn.close()
    return jsonify(response)

@app.route('/api/users/delete/<username>', methods=['DELETE'])
def delete_user(username):
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "DELETE FROM Users WHERE Username = %s"
    cursor.execute(sql, [username])
    conn.commit()
    response = {'message': 'User record deleted successfully'} if cursor.rowcount else {'message': 'User not found'}
    cursor.close()
    conn.close()
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
    