import os
import sys

def getValue(): 
    print(sys.argv[0]) # PythonTest_01.py
    print(sys.argv[1]) # aaaa
    # os.system("curl " + sys.argv[1] + " > ./image/qrImage.png")
    

if __name__ == '__main__': 
    getValue()
