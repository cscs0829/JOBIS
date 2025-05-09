# DB/Connection.py
import asyncpg # 비동기 연결

DB_HOST = ""
DB_PORT = 3310
DB_NAME = ""
DB_USER = ""
DB_PASSWORD = ""

async def get_db_connection(): # DB연결 만들어주는 함수
    conn = await asyncpg.connect( # DB서버 접속
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn
