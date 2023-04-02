import React, { useState } from "react";
import Plot from "react-plotly.js";
import PolynomialGraph from "./PolynomialGraph";
// 12. Polynomial Interpolator:Write a GUI based tool that reads a prime number q and hence n + 1
// evaluations of a univariate polynomial f(x) over Fq as input and demonstrates the sequence of steps
// involved in the reconstruction of f, assuming f to be of degree n.

const App = () => {
  const [q, setQ] = useState(0);
  const [n, setN] = useState(0);
  const [evaluationsX, setEvaluationsX] = useState([]);
  const [evaluationsY, setEvaluationsY] = useState([]);
  const [interpolated, setInterpolated] = useState(false);
  const [coefficients, setCoefficients] = useState([]);
  // const evaluations = zip(evaluationsX, evaluationsY); // zip the x and y coordinates
  // console.log(evaluations)
  console.log(evaluationsX, evaluationsY);

  // include field size q in all calculations
  function polyEval(coeffs, x, q) {
    // given coeffs[0] + coeffs[1] x + ... + coeffs[n] x^n, return the value of the polynomial at x
    var y = 0;
    var i;
    for (i = coeffs.length; i-- > 0; ) y = y * x + coeffs[i];
    y = y % q;
    return y;
  }

  function polyAdd(aCoeffs, bCoeffs, q) {
    //sum of two polynomials, given as arrays of coefficients
    var ret = [];
    var i;

    for (i = 0; i < aCoeffs.length || i < bCoeffs.length; i++) {
      var a = i < aCoeffs.length ? aCoeffs[i] : 0;
      var b = i < bCoeffs.length ? bCoeffs[i] : 0;
      ret.push(a + (b % q));
    }
    return ret;
  }

  function polyMul(aCoeffs, bCoeffs, q) {
    // product of two polynomials, given as arrays of coefficients
    var ret = [];
    var i, j;

    while (ret.length < aCoeffs.length + bCoeffs.length - 1) ret.push(0);
    for (i = 0; i < aCoeffs.length; i++) {
      for (j = 0; j < bCoeffs.length; j++) {
        ret[i + j] += (aCoeffs[i] * bCoeffs[j]) % q;
      }
    }
    return ret;
  }

  function lagrangeInterpolate(points, q) {
    console.log(points, q);
    q = parseInt(q);
    // given an array of points, return the coefficients of the Lagrange interpolating polynomial
    var ret = [0];
    var i, j;

    for (i = 0; i < points.length; i++) {
      var x = points[i].x,
        y = points[i].y;
      var P = [1],
        denom = 1;
      for (j = 0; j < points.length; j++) {
        if (j == i) continue;
        var x2 = points[j].x,
          y2 = points[j].y % q;
        P = polyMul(P, [-x2, 1], q);
        denom *= x - (x2 % q);
      }
      ret = polyAdd(ret, polyMul(P, [y / denom], q), q);
    }
    for (i = 0; i < ret.length; i++) ret[i] = (ret[i] + q) % q;
    setCoefficients(ret);
    return ret;
  }

  // const q=5
  // const points = [{x: 0, y: 1}, {x: 1, y: 0},{x: 2, y: 1}]
  // console.log(lagrangeInterpolate(points))
  const interpolate = (e, q, n, evaluationsX, evaluationsY) => {
    e.preventDefault();
    setInterpolated(true);
    const zip = (a, b) => a.map((k, i) => [k, b[i]]);
    // const a = [1,2,3,4,5,6,7,8,9,10]
    // const b = [1,2,3,4,5,6,7,8,9,10]
    // const evaluations = zip(a, b); // zip the x and y coordinates
    console.log(evaluationsX, evaluationsY);
    const a = [];
    for (let i = 0; i < evaluationsX.length; i++) {
      a.push(parseInt(evaluationsX[i]));
    }
    const b = [];
    for (let i = 0; i < evaluationsY.length; i++) {
      b.push(parseInt(evaluationsY[i]));
    }
    console.log(a, b);
    const points = [];
    for (let i = 0; i < a.length; i++) {
      points.push({ x: parseInt(a[i]), y: parseInt(b[i]) });
    }
    console.log(points);
    console.log(lagrangeInterpolate(points, q));
  };

  return (
    <>
      {/* Langrange formulat */}
      <p>
        <b>Langrange Interpolation:</b>
      </p>
      <img src="../public/li.jpg" alt="langrange" />
      <p>
        <b>Input:</b> n+1 points (x<sub>i</sub>, y<sub>i</sub>) on a curve over
        F<sub>q</sub>, where q is a prime number
      </p>
        <p>
          <b>Note:-</b>
          Input comma separated values for x and y coordinates (no space) <br />
          <b>Example</b> - Input q=5,n=3,x=0,1,2,y=1,0,1

        </p>

      {/* input field q */}
      <input
        type="number"
        // value={q}
        placeholder="Enter q"
        onChange={(e) => setQ(e.target.value)}
      />
      {/* input field n */}
      <input
        type="number"
        // value={n}
        placeholder="Enter n"
        onChange={(e) => setN(e.target.value)}
      />
      {/* n+1 space separated numbers x-coordinate */}
      <input
        type="text"
        // value={evaluationsX}
        placeholder="Enter evaluations for x"
        onChange={(e) => setEvaluationsX(e.target.value.split(","))}
      />
      {/* n+1 space separated numbers y-coordinate */}
      <input
        type="text"
        // value={evaluationsY}
        placeholder="Enter evaluations for y"
        onChange={(e) => setEvaluationsY(e.target.value.split(","))}
      />
      {/* button to start the interpolation */}
      <button onClick={(e) => interpolate(e, q, n, evaluationsX, evaluationsY)}>
        Interpolate
      </button>
      {interpolated && (
        <div>
          {/* Lagrange general formula */}
          <p></p>
          {/* All coefficients */}
          <h2>Field Size</h2>
          <p>{q}</p>
          {/* Points */}
          <h2>Points</h2>
          <p>
            {evaluationsX.map((x, i) => (
              <span key={i}>
                ({x}, {evaluationsY[i]})
              </span>
            ))}
          </p>
          {/* Polynomial */}
          <h2>Polynomial</h2>
          <p>
            f(x)=
            {coefficients.map((c, i) => (
              <span key={i}>
                {c}x<sup>{i}</sup>
                {i < coefficients.length - 1 ? " + " : ""}
              </span>
            ))}
          </p>
          {/* Test generated polynomial for all inputs */}
          <h2>Test</h2>
          <p>
            {evaluationsX.map((x, i) => (
              <span key={i}>
                f({x})={evaluationsY[i]}{" "}
                {coefficients.reduce((acc, c, i) => { // evaluate the polynomial at x
                  acc += c * Math.pow(x, i);
                  return acc;
                }) %
                  q ==
                evaluationsY[i]
                  ? "✅"
                  : "❌"}
                <br />
              </span>
            ))}
          </p>
          {/* Graph */}
          {/* <h2>Graph</h2> */}
          {/* <PolynomialGraph coefficients={coefficients} /> */}
          {/* <img src="./poly.png"/> */}
        </div>
      )}
    </>
  );
};

export default App;
