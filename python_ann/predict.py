import tensorflow as tf
from tensorflow import keras
import numpy as np
import sklearn, sys, json
import pandas as pd
import urllib.parse
import dateutil.parser
import datetime, holidays
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import Normalizer
from sklearn.preprocessing import MinMaxScaler

building = sys.argv[1]
room = urllib.parse.unquote(sys.argv[2])
reading = sys.argv[3]
data = []
f = open('./python_ann/data.txt', 'r')
data = json.loads(f.read())
averages = data[-6:]
data = data[:-6]
x_pred = []
pred_out = []
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
    x_pred.append([averages[0], averages[1], averages[2], averages[3], averages[4], averages[5], NotWeekend, InOperatingHours, NotHoliday, item[1], item[2], item[3], item[4], item[5], item[6], item[7]])
    pred_out.append([item[1], item[2], item[3], item[5], item[6], item[7], NotWeekend, InOperatingHours, NotHoliday,])

model = keras.models.load_model("./python_ann/{}_Model.h5".format(reading))

xFit = pd.read_csv('./python_ann/{}_xTrain.csv'.format(reading), header=0)
yFit = pd.read_csv('./python_ann/{}_yTrain.csv'.format(reading), header=0)

x_pred_final = x_pred
x_train_full = xFit.to_numpy(dtype=np.float32)
y_train_full = yFit.to_numpy(dtype=np.float32)

scaler_x = MinMaxScaler()
scaler_x.fit(x_train_full)
x_pred_final = scaler_x.transform(x_pred_final)
scaler_y = MinMaxScaler()
scaler_y.fit(y_train_full)
y_out = scaler_y.inverse_transform(model.predict(x_pred_final))
for index, e in enumerate(y_out):
    if e < 0:
        e = 0
        y_out[index] = e
y_out = np.ndarray.tolist((np.reshape(y_out, (1, -1))))



for index, row in enumerate(pred_out):
    row.append(y_out[0][index])
    row.append(dates[index])

print(json.dumps(pred_out))