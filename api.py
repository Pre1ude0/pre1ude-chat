import sqlite3

def connect() -> sqlite3.Connection:
    return sqlite3.connect('chat.db')

def start():

    command = """CREATE TABLE IF NOT EXISTS messages (
        author TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );"""

    conn = connect()
    cursor = conn.cursor()
    cursor.execute(command)
    conn.close()


def get_messages():
    
    command = "SELECT * FROM messages;"
    
    conn = connect()    
    cursor = conn.cursor()
    cursor.execute(command)
    messages = cursor.fetchall()
    conn.close()

    json_messages = []

    for message in messages:
        json_messages.append({
            "author": message[0],
            "message": message[1],
            "timestamp": message[2]
        })

    return json_messages


def add_message(author, message):

    command = f"INSERT INTO messages (author, message) VALUES ('{author}', '{message}');"

    conn = connect()
    cursor = conn.cursor()
    cursor.execute(command)
    conn.commit()
    conn.close()
