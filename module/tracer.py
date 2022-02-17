import os
import sys
import cv2
import numpy as np
import requests
import pyzbar.pyzbar as pyzbar
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def main():
    # print(sys.argv[0]) # FileName.py
    # print(sys.argv[1]) # First Value

    # imgfile = 'images/sample_00.png'
    imgfileURL = sys.argv[1]
    print(imgfileURL)
    
    # os.system("curl " + sys.argv[1] + " > ./images/qrImage.png")   
    # imgfile = 'images/qrImage.png'
    imageNparray = np.asarray(bytearray(requests.get(imgfileURL, verify=False).content), dtype=np.uint8)
    imageConvert = cv2.imdecode(imageNparray, cv2.IMREAD_COLOR)
    # img = cv2.imread(imageConvert)
    imgGray = cv2.cvtColor(imageConvert, cv2.COLOR_BGR2GRAY)
    imgHSV = cv2.cvtColor(imageConvert, cv2.COLOR_BGR2HSV)
    imgRGB = cv2.cvtColor(imageConvert, cv2.COLOR_BGR2RGB)
    
    qrExist=False
    pointX=0
    pointY=0
    baseLine=0
    
    scaleValue = 1
    splitValue = 1
    baseValue = 269
    baseSpace = 705
    baseSplit = 112
    
    decoded = pyzbar.decode(imgGray)
    # print(decoded)
    if len(decoded) == 0 :
        # print('no qr-code')
        qrExist = False
    else :
        qrExist = True

    
    for d in decoded:
#         print(d.data.decode('utf-8'))
        pointX = d.rect[0]
        pointY = d.rect[1]
        baseLine = (int)(d.rect[2]+d.rect[3])/2
    
    # print(baseLine)
    scaleValue = baseLine/baseValue
    # print(scaleValue)
    splitValue = (int)(baseSplit*scaleValue)
    pointX = pointX + (int)(baseSpace*scaleValue)
    pointY = pointY + (int)(baseLine/2)
    
    # print(pointX)
    # print(pointY)
    cl0 = imgHSV[pointY,pointX]
    cl1 = imgHSV[pointY,pointX+splitValue]
    cl2 = imgHSV[pointY,pointX+2*splitValue]


    cr0 = imgRGB[pointY,pointX]
    cr1 = imgRGB[pointY,pointX+splitValue]
    cr2 = imgRGB[pointY,pointX+2*splitValue]
    
    print(qrExist)
    print('[{0},{1},{2}]'.format(cl0[0],cl0[1],cl0[2]))
    print('[{0},{1},{2}]'.format(cl1[0],cl1[1],cl1[2]))
    print('[{0},{1},{2}]'.format(cl2[0],cl2[1],cl2[2]))
    print('[{0},{1},{2}]'.format(cr0[0],cr0[1],cr0[2]))
    print('[{0},{1},{2}]'.format(cr1[0],cr1[1],cr1[2]))
    print('[{0},{1},{2}]'.format(cr2[0],cr2[1],cr2[2]))
    print(decoded)
    
    
if __name__ == '__main__':
    main()