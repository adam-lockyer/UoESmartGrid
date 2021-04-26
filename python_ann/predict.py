import tensorflow as tf
from tensorflow import keras
import numpy as np
import sklearn, sys, json
import pandas as pd
import urllib.parse
import dateutil.parser
import datetime, holidays
from sklearn.preprocessing import StandardScaler

building = sys.argv[1]
room = urllib.parse.unquote(sys.argv[2])
reading = sys.argv[3]

data = []
f = open('./python_ann/data.txt', 'r')
data = json.loads(f.read())
x_pred = []
dates = []
for item in data:
    formattedDate = datetime.datetime.strptime("{} {}".format(item[0][0:10], item[0][11:16]), "%Y-%m-%d %H:%M")
    dates.append(datetime.datetime.strftime(formattedDate, '%Y-%m-%d %H:%M'))
    NotWeekend = 0 if formattedDate.weekday() == 5 or formattedDate.weekday() == 6 else 1
    InOperatingHours = 1 if 6 <= formattedDate.hour <= 19 else 0
    NotHoliday = 1
    for date in holidays.UnitedKingdom(years=int(formattedDate.year)).items():
        if "[" not in date[1] or "England" in date[1]:
            if formattedDate == (date[0].strftime('%Y-%m-%d')):
                NotHoliday = 0
                break
    x_pred.append([ NotHoliday, NotWeekend, InOperatingHours, item[3], item[5]])

pred_out = x_pred

model = keras.models.load_model("./python_ann/{}_{}_{}_Model.h5".format(building, room, reading))

df = pd.read_csv('./python_ann/ScalerFit({}-{}-{}).csv'.format(building, room, reading), header=0)
df = df[df.Reading != 0]
uv = np.percentile(df.Reading, [99])[0]
df.Reading[df.Reading > 2*uv] = 2*uv
lv = np.percentile(df.Reading, [1])[0]
df.Reading[df.Reading < 0.5*lv] = 0.5*lv
selectionArray = ""
if reading == 'Electric':
    selectionArray = ["Datetime", "NotHoliday", "NotWeekend", "InOperatingHours", "Temperature", "Humidity"]
elif reading == 'Gas':
    selectionArray = ["Datetime", "NotHoliday", "NotWeekend", "InOperatingHours", "Temperature", "Humidity"]
elif reading == 'Water':
    selectionArray = ["Datetime", "NotHoliday", "NotWeekend", "InOperatingHours", "Temperature", "Humidity"]

x_train_full = df[selectionArray][:8000]
x_train_full = x_train_full.drop(columns="Datetime")
x_train_full = x_train_full.to_numpy(dtype=np.float32)
y_train_full = df[["Datetime", "Reading"]][:8000]
y_train_full = y_train_full.drop(columns="Datetime")
y_train_full = y_train_full.to_numpy(dtype=np.float32)

scaler_x = StandardScaler()
scaler_x.fit(x_train_full)
x_pred = scaler_x.transform(x_pred)

scaler_y = StandardScaler()
scaler_y.fit(y_train_full)
y_out = scaler_y.inverse_transform(model.predict(x_pred))
y_out = np.ndarray.tolist((np.reshape(y_out, (1, -1))))

for index, row in enumerate(pred_out):
    row.append(y_out[0][index])
    row.append(dates[index])

print(json.dumps(pred_out))