import numpy as np
import pandas as pd
import holidays
from datetime import datetime


def preprocess(df):
    df['timestamp'] = pd.to_datetime(df['datetime'])
    df.set_index('timestamp', inplace=True)
    df[['conditions', 'temperature']] = df['weather'].str.extract(r'(\w+)\s+(\d+)C')
    df['conditions'] = df['conditions'].astype('category').cat.codes
    df['temperature'] = df['temperature'].astype(int)
    df['availability'] = availability(df, 7)
    return df

def availability(df, k):
    
    if len(df) < 2:
        return None

    timestamps = df.index.values
    if len(timestamps) <= k:
        lastk = df.copy()
    else:
        # QuickSelect
        kth_recent = np.partition(timestamps, -k)[-k]  
        lastk = df[df.index >= kth_recent]

    lastk = lastk.sort_index()
    lastk['next_timestamp'] = lastk.index.to_series().shift(-1)
    lastk = lastk.iloc[:-1]

    lastk['diff'] = (lastk['next_timestamp'] - lastk.index).total_seconds()
    total = lastk['diff'].sum()
    free = lastk.loc[lastk['isFree'] == 1, 'diff'].sum()
    
    return free/total if total > 0 else None

def add_features(df):
    df['isWeekend'] = df.index.dayofweek >= 5
    df['isHoliday'] = df.index.to_series().apply(lambda x: x in holidays.GR()) # opa argies
    df['season']    = df.index.month%12 // 3 + 1  # 1: Winter, 2: Spring, 3: Summer, 4: Fall
    df['year']      = df.index.year
    df['day']       = df.index.dayofweek
    df['hour']      = df.index.hour
    return df