import mysql.connector
import pandas as pd
import os

def DB_connect():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

# fetches all parking instances at a given spot
def fetch(lat, lon):
    conn = DB_connect()
    query = """
    SELECT parking_id, lat, lon, start_time, end_time, start_weather, end_weather
    FROM parking
    WHERE lat = %s AND lon = %s
    """
    df = pd.read_sql_query(query, conn, params=(lat,lon,))
    conn.close()
    return df

# fetches all DISTINCT parking spots ([lat, long] pairs are unique for each spot} (OBSOLETE) 
def fetch_all():
    conn = DB_connect()
    query = """
    SELECT DISTINCT lat, lon
    FROM parking
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df