import mysql.connector
import pandas as pd

def connect_to_db():
    return mysql.connector.connect(
        host="your_host",
        user="your_user",
        password="your_password",
        database="parkathon"
    )

def fetch(lon, lat):
    conn = connect_to_db()
    query = """
    SELECT parking_id, lat, long, start_time, end_time, weather
    FROM parking
    WHERE long = %s AND lat = %s
    """
    df = pd.read_sql_query(query, conn, params=(lon,lat,))
    conn.close()
    return df

def fetch_all():
    conn = connect_to_db()
    query = """
    SELECT DISTINCT lat, long
    FROM parking
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df