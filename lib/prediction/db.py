import mysql.connector
import pandas as pd
import os

def connect_to_db():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

# fetches all parking instances at a given spot
def fetch(lon, lat):
    conn = connect_to_db()
    query = """
    SELECT parking_id, lat, long, start_time, end_time, start_weather, end_weather
    FROM parking
    WHERE long = %s AND lat = %s
    """
    df = pd.read_sql_query(query, conn, params=(lon,lat,))
    conn.close()
    return df

# fetches all DISTINCT parking spots ([lat, long] pairs are unique for each spot} 
def fetch_all():
    conn = connect_to_db()
    query = """
    SELECT DISTINCT lat, long
    FROM parking
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df