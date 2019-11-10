export default function sketch(p) {
  console.log(p)
  let canvas;
  var drawing = [];

  p.setup = () => {
    canvas = p.createCanvas(200, 200);
    p.noStroke();
  }

  p.draw = () => {
    p.background(0);

  }

  // p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
  //   if(canvas) //Make sure the canvas has been created
  //     p.fill(newProps.color);
  // }
}