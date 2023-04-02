coeff=[1,3,1]
# plot  poly = 1 + 3x + x^2

import numpy as np
import matplotlib.pyplot as plt

def poly(x,coeff):
    y=0
    for i in range(len(coeff)):
        y+=coeff[i]*x**i
    return y

x=np.linspace(-1000,1000,100)
y=poly(x,coeff)
plt.plot(x,y)
plt.show()
plt.savefig('./poly.png')