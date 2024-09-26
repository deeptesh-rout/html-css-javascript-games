/*

A video walkthrough of each SVGs source code: https://youtu.be/t8ZG3xlLsOY

Follow me on twitter for more: https://twitter.com/HunorBorbely

*/

// Return a random item from an array
function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// The possible values of each feature
const colors = ["#72C264", "#FAC44C", "#EF5169"];
const shadings = ["solid", "striped", "open"];
const shapes = ["circle", "tree", "star"];
const numbers = [1, 2, 3];

// Generates a random bauble
const generateBauble = () => ({
  color: pick(colors),
  shading: pick(shadings),
  shape: pick(shapes),
  number: pick(numbers),
  selected: false });


// Generates a random bauble that's not in the given array
const generateBaubleNotInArray = array => {
  const bauble = generateBauble();
  if (!baubleIsInArray(array, bauble)) return bauble;
  return generateBaubleNotInArray(array);
};

// Check is bauble is already in array or not
const baubleIsInArray = (baubles, bauble) =>
baubles.find(
(b) =>
b.color == bauble.color &&
b.shading == bauble.shading &&
b.shape == bauble.shape &&
b.number == bauble.number);


const generateBaubles = () => {
  const baubles = [];
  while (baubles.length < 12) {
    const bauble = generateBaubleNotInArray(baubles);
    baubles.push(bauble);
  }
  if (thereIsAtLeastOneSet(baubles)) return baubles;
  return generateBaubles();
};

const replaceSet = baubles => {
  const newBaubles = [];
  const remainingBaublesUnordered = baubles.filter(b => !b.selected);
  baubles.forEach(b => {
    if (!b.selected) return newBaubles.push(b);

    const newBauble = generateBaubleNotInArray(remainingBaublesUnordered);
    remainingBaublesUnordered.push(newBauble);
    newBaubles.push(newBauble);
  });

  if (thereIsAtLeastOneSet(newBaubles)) return newBaubles;
  return replaceSet(baubles);
};

const selectBauble = (baubles, index) =>
baubles.map((b, i) => i == index ? { ...b, selected: !b.selected } : b);

const getSet = baubles => {
  for (let i1 = 0; i1 < baubles.length - 2; i1++) {
    for (let i2 = i1 + 1; i2 < baubles.length - 1; i2++) {
      for (let i3 = i2 + 1; i3 < baubles.length; i3++) {
        if (itIsASet(baubles[i1], baubles[i2], baubles[i3])) {
          console.log("Psst! Here's a solution:", i1 + 1, i2 + 1, i3 + 1);
          return [i1, i2, i3];
        }
      }
    }
  }

  return undefined;
};

const thereIsAtLeastOneSet = baubles => {
  return getSet(baubles) != undefined;
};

const highlightSet = baubles => {
  const setIndexes = getSet(baubles);

  const newBaubles = baubles.map((b, i) => {
    if (setIndexes.includes(i))
    return {
      ...b,
      selected: true };

    return b;
  });

  return newBaubles;
};

const itIsASet = (bauble1, bauble2, bauble3) => {
  const {
    colorsFitCriteria,
    shadingsFitCriteria,
    shapesFitCriteria,
    numberFitCriteria } =
  getCriteria(bauble1, bauble2, bauble3);

  return (
    colorsFitCriteria &&
    shadingsFitCriteria &&
    shapesFitCriteria &&
    numberFitCriteria);

};

const getCriteria = (bauble1, bauble2, bauble3) => {
  const selectedColors = [bauble1.color, bauble2.color, bauble3.color];
  const selectedShadings = [bauble1.shading, bauble2.shading, bauble3.shading];
  const selectedShapes = [bauble1.shape, bauble2.shape, bauble3.shape];
  const selectedNumbers = [bauble1.number, bauble2.number, bauble3.number];

  return {
    colorsFitCriteria:
    allTheSame(selectedColors) || allDifferent(selectedColors),
    shadingsFitCriteria:
    allTheSame(selectedShadings) || allDifferent(selectedShadings),
    shapesFitCriteria:
    allTheSame(selectedShapes) || allDifferent(selectedShapes),
    numberFitCriteria:
    allTheSame(selectedNumbers) || allDifferent(selectedNumbers) };

};

const threeBaublesAreSelected = (baubles) =>
baubles.filter(b => b.selected).length == 3;

const allTheSame = values => values[0] == values[1] && values[0] == values[2];

const allDifferent = (values) =>
values[0] != values[1] && values[0] != values[2] && values[1] != values[2];

const demoBaubles = [
{
  color: "#FAC44C",
  shading: "striped",
  shape: "circle",
  number: 2,
  selected: false },

{
  color: "#FAC44C",
  shading: "open",
  shape: "tree",
  number: 2,
  selected: true },

{
  color: "#EF5169",
  shading: "striped",
  shape: "tree",
  number: 3,
  selected: true },

{
  color: "#EF5169",
  shading: "open",
  shape: "tree",
  number: 3,
  selected: false },

{
  color: "#FAC44C",
  shading: "solid",
  shape: "tree",
  number: 1,
  selected: false },

{
  color: "#EF5169",
  shading: "striped",
  shape: "circle",
  number: 1,
  selected: false },

{
  color: "#FAC44C",
  shading: "open",
  shape: "circle",
  number: 2,
  selected: false },

{
  color: "#72C264",
  shading: "striped",
  shape: "star",
  number: 2,
  selected: false },

{
  color: "#EF5169",
  shading: "solid",
  shape: "circle",
  number: 2,
  selected: false },

{
  color: "#72C264",
  shading: "solid",
  shape: "tree",
  number: 2,
  selected: false },

{
  color: "#72C264",
  shading: "solid",
  shape: "tree",
  number: 1,
  selected: true },

{
  color: "#FAC44C",
  shading: "solid",
  shape: "tree",
  number: 3,
  selected: false }];



function App() {
  const [baubles, setBaubles] = React.useState(demoBaubles);
  const [score, setScore] = React.useState(0);
  const [phase, setPhase] = React.useState("demo");

  const select = index => {
    if (phase == "demo") return;
    let newBaubles = selectBauble(baubles, index);

    if (threeBaublesAreSelected(newBaubles)) {
      const selectedBaubles = newBaubles.filter(b => b.selected);

      // If the three selected baubles are a set then replace them
      if (
      itIsASet(selectedBaubles[0], selectedBaubles[1], selectedBaubles[2]))
      {
        setScore(score + 1);
        newBaubles = replaceSet(newBaubles);
      } else {
        // If the three selected baubles are not a set then the player failed
        setPhase("failed");
      }
    }

    setBaubles(newBaubles);
  };

  const start = () => {
    // Start the game
    setBaubles(generateBaubles());
    setPhase("game");
  };

  const timeUp = () => {
    // Highlight the possible set
    setBaubles(highlightSet(baubles));
    setPhase("time-up");
  };

  return /*#__PURE__*/(
    React.createElement("div", { className: "container" }, /*#__PURE__*/
    React.createElement("div", { className: "grid " + phase },
    baubles.map(({ color, shading, shape, number, selected }, index) => /*#__PURE__*/
    React.createElement(Bauble, {
      key: `${index}-${color}-${shading}-${shape}-${number}`,
      index: index,
      color: color,
      shading: shading,
      shape: shape,
      number: number,
      selected: selected,
      select: select }))),



    phase == "demo" && /*#__PURE__*/
    React.createElement("div", { className: "sidebar" }, /*#__PURE__*/
    React.createElement("p", { className: "less-important" }, "This game is based on the card game",
    " ", /*#__PURE__*/
    React.createElement("b", null, /*#__PURE__*/
    React.createElement("a", {
      href: "https://en.wikipedia.org/wiki/Set_(card_game)",
      target: "_blank" }, "Set")), "."), /*#__PURE__*/






    React.createElement("p", null, "Pick a set of three baubles where the following is true:"), /*#__PURE__*/
    React.createElement("p", null, "For each one of the four categories of features \u2014 color, number, shape, and shading \u2014 the three baubles must display that feature as a) either all the same, or b) all different."), /*#__PURE__*/




    React.createElement("p", null, "This example is a set, because they all have ", /*#__PURE__*/
    React.createElement("b", null, "different colors"), ", they all have ", /*#__PURE__*/
    React.createElement("b", null, "different numbers"), ", they all have the", " ", /*#__PURE__*/
    React.createElement("b", null, "same shape"), " and they all have ", /*#__PURE__*/React.createElement("b", null, "different shading"), "."), /*#__PURE__*/

    React.createElement("button", { onClick: start }, "Start")),


    phase == "game" && /*#__PURE__*/
    React.createElement("div", { className: "sidebar" }, /*#__PURE__*/
    React.createElement(Score, { score: score }), /*#__PURE__*/
    React.createElement(Timer, { key: score, timeUp: timeUp }), /*#__PURE__*/

    React.createElement("p", null, "For each one of the four categories of features \u2014 color, number, shape, and shading \u2014 the three baubles must display that feature as a) either all the same, or b) all different.")),






    (phase == "time-up" || phase == "failed") && /*#__PURE__*/
    React.createElement("div", { className: "sidebar" }, /*#__PURE__*/
    React.createElement(Score, { score: score }),
    phase == "failed" && /*#__PURE__*/React.createElement(ErrorMessage, { baubles: baubles }),
    phase == "time-up" && /*#__PURE__*/React.createElement(TimeUpMessage, null), /*#__PURE__*/

    React.createElement("button", { onClick: start }, "Play again"), /*#__PURE__*/
    React.createElement(Twitter, null))));




}

// Utility hook for requestAnimationFrame
const useAnimationFrame = callback => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = time => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
};

function Timer({ timeUp }) {
  const time = 60;
  const [timeLeft, setTimeLeft] = React.useState(time * 1000);

  useAnimationFrame(deltaTime => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
    setTimeLeft(prevTime => prevTime - deltaTime);
  });

  if (timeLeft < 0) timeUp();

  const timeLeftInSeconds = Math.floor(timeLeft / 1000);
  const radius = 70;
  const circumference = 2 * radius * Math.PI;

  return /*#__PURE__*/(
    React.createElement("svg", { width: "250", height: "200", viewBox: "-100 -100 200 200" }, /*#__PURE__*/
    React.createElement("path", {
      d: `M -1 -${radius} A ${radius} ${radius} 0 1 0 0 -${radius}`,
      stroke: "white",
      "stroke-width": "20",
      fill: "none",
      "stroke-dasharray": `${circumference / (time * 1000) * timeLeft} 1000` }), /*#__PURE__*/

    React.createElement("text", {
      "text-anchor": "middle",
      "dominant-baseline": "central",
      "font-size": "2.5em",
      "font-weight": "bold",
      fill: "white" },

    timeLeftInSeconds)));



}

function Score({ score }) {
  return /*#__PURE__*/(
    React.createElement("div", { className: "score" }, /*#__PURE__*/
    React.createElement("h3", null, "Score"), /*#__PURE__*/
    React.createElement("h1", null, score)));


}

function TimeUpMessage() {
  return /*#__PURE__*/React.createElement("p", { className: "result" }, "Time's up!");
}

function ErrorMessage({ baubles }) {
  const selectedBaubles = baubles.filter(b => b.selected);

  const {
    colorsFitCriteria,
    shadingsFitCriteria,
    shapesFitCriteria,
    numberFitCriteria } =
  getCriteria(selectedBaubles[0], selectedBaubles[1], selectedBaubles[2]);

  return /*#__PURE__*/(
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("p", null, "You picked a wrong combination"),
    !colorsFitCriteria && /*#__PURE__*/
    React.createElement("p", null, "Colors don't fit the criteria. They should be either all the same or all different"),




    !shadingsFitCriteria && /*#__PURE__*/
    React.createElement("p", null, "Shadings don't fit the criteria. They should be either all the same or all different"),




    !shapesFitCriteria && /*#__PURE__*/
    React.createElement("p", null, "Shapes don't fit the criteria. They should be either all the same or all different"),




    !numberFitCriteria && /*#__PURE__*/
    React.createElement("p", null, "Number of shapes don't fit the criteria. They should be either all the same or all different")));






}

function Twitter() {
  return /*#__PURE__*/(
    React.createElement("p", { className: "twitter" }, "Follow me",
    " ", /*#__PURE__*/
    React.createElement("a", { href: "https://twitter.com/HunorBorbely", target: "_blank" }, "@HunorBorbely")));




}

function Bauble({ index, color, shading, shape, number, selected, select }) {
  const motifFill = {
    solid: "#5f4c6c",
    striped: "url(#stripe)",
    open: "transparent" }[
  shading];

  return /*#__PURE__*/(
    React.createElement("svg", {
      viewBox: "-100 -100 200 200",
      onClick: () => select(index),
      className: "bauble " + (selected && "selected") }, /*#__PURE__*/

    React.createElement("defs", null, /*#__PURE__*/
    React.createElement("radialGradient", { id: "shine", cx: "0.25", cy: "0.25", r: "0.35" }, /*#__PURE__*/
    React.createElement("stop", { offset: "0%", "stop-color": "white", "stop-opacity": "0.5" }), /*#__PURE__*/
    React.createElement("stop", { offset: "100%", "stop-color": "white", "stop-opacity": "0" })), /*#__PURE__*/


    React.createElement("pattern", {
      id: "stripe",
      patternUnits: "userSpaceOnUse",
      width: "10",
      height: "6" }, /*#__PURE__*/

    React.createElement("rect", { x: "0", y: "2.5", width: "10", height: "3", fill: "#5f4c6c" }))), /*#__PURE__*/



    React.createElement("circle", { cx: "0", cy: "20", r: "65", fill: color }), /*#__PURE__*/

    React.createElement("g", {
      transform: "translate(0, 20)",
      fill: motifFill,
      stroke: "#5f4c6c",
      "stroke-width": "3" }, /*#__PURE__*/

    React.createElement(Motif, { shape: shape, number: number })), /*#__PURE__*/


    React.createElement("circle", { cx: "0", cy: "20", r: "65", fill: "url(#shine)" }), /*#__PURE__*/

    React.createElement("circle", {
      cx: "0",
      cy: "-70",
      r: "12",
      fill: "none",
      stroke: "#F79257",
      "stroke-width": "2" }), /*#__PURE__*/

    React.createElement("rect", { x: "-17.5", y: "-60", width: "34", height: "20", fill: "#F79257" })));


}

function Motif({ shape, number }) {
  const Shape = {
    tree: Tree,
    circle: Circle,
    star: Star }[
  shape];

  if (number == 1) {
    return /*#__PURE__*/React.createElement(Shape, null);
  }

  if (number == 2) {
    return /*#__PURE__*/(
      React.createElement("g", null, /*#__PURE__*/
      React.createElement(Shape, { transform: "translate(-30, 0)" }), /*#__PURE__*/
      React.createElement(Shape, { transform: "translate(30, 0)" })));


  }

  return /*#__PURE__*/(
    React.createElement("g", null, /*#__PURE__*/
    React.createElement(Shape, null), /*#__PURE__*/
    React.createElement(Shape, { transform: "translate(-40, 0)" }), /*#__PURE__*/
    React.createElement(Shape, { transform: "translate(40, 0)" })));


}

function Circle({ transform }) {
  return /*#__PURE__*/React.createElement("circle", { r: "15", transform: transform });
}

function Star({ transform }) {
  return /*#__PURE__*/(
    React.createElement("polygon", {
      points: "0,-20 6,-8 19,-6 10,3 12,16 0,10 -12,16 -10,3 -19,-6 -6,-8",
      transform: transform }));


}

function Tree({ transform }) {
  return /*#__PURE__*/(
    React.createElement("polygon", {
      points: " 0,-24 8,-8 6,-8 12,4 10,4 16,16 4,16 4,22 -4,22 -4,16 -16,16 -10,4 -12,4 -6,-8 -8,-8",


      transform: transform }));


}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));