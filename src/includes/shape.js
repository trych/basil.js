// ----------------------------------------
// Shape

/**
 * Draws an ellipse (oval) in the display window. An ellipse with an equal <b>width</b> and <b>height</b> is a circle.
 * The first two parameters set the location, the third sets the width, and the fourth sets the height.
 *
 * @cat Document
 * @subcat Primitives
 * @method ellipse
 * @param {Number} x X-coordinate of the ellipse.
 * @param {Number} y Y-coordinate of the ellipse.
 * @param {Number} w Width of the ellipse.
 * @param {Number} h Height of the ellipse.
 * @return {Oval} New Oval (in InDesign Scripting terms the corresponding type is Oval, not Ellipse).
 */
pub.ellipse = function(x, y, w, h) {
  if (arguments.length !== 4) error("b.ellipse(), not enough parameters to draw an ellipse! Use: x, y, w, h");
  var ellipseBounds = [];
  if (currEllipseMode === pub.CORNER) {
    ellipseBounds[0] = y;
    ellipseBounds[1] = x;
    ellipseBounds[2] = (y + h);
    ellipseBounds[3] = (x + w);
  } else if (currEllipseMode === pub.CORNERS) {
    ellipseBounds[0] = y;
    ellipseBounds[1] = x;
    ellipseBounds[2] = h;
    ellipseBounds[3] = w;
  } else if (currEllipseMode === pub.CENTER) {
    ellipseBounds[0] = y - (h / 2);
    ellipseBounds[1] = x - (w / 2);
    ellipseBounds[2] = (y + h) - (h / 2);
    ellipseBounds[3] = (x + w) - (w / 2);
  } else if (currEllipseMode === pub.RADIUS) {
    ellipseBounds[0] = y - (h);
    ellipseBounds[1] = x - (w);
    ellipseBounds[2] = y + (h);
    ellipseBounds[3] = x + (w);
  }

  if(w === 0 || h === 0)
    {return false;}

  var ovals = currentPage().ovals;
  var newOval = ovals.add(currentLayer());

  newOval.strokeWeight = currStrokeWeight;
  newOval.strokeTint = currStrokeTint;
  newOval.fillColor = currFillColor;
  newOval.fillTint = currFillTint;
  newOval.strokeColor = currStrokeColor;
  newOval.geometricBounds = ellipseBounds;

  if (currEllipseMode === pub.CENTER || currEllipseMode === pub.RADIUS) {
    newOval.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                       AnchorPoint.CENTER_ANCHOR,
                       currMatrix.adobeMatrix());
  } else {
    newOval.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                   AnchorPoint.TOP_LEFT_ANCHOR,
                   currMatrix.adobeMatrix());
  }
  return newOval;
};

/**
 * Draws a line (a direct path between two points) to the page.
 *
 * @cat Document
 * @subcat Primitives
 * @method line
 * @param {Number} x1 X-coordinate of Point 1.
 * @param {Number} y1 Y-coordinate of Point 1.
 * @param {Number} x2 X-coordinate of Point 2.
 * @param {Number} y2 Y-coordinate of Point 2.
 * @return {GraphicLine} New GraphicLine.
 */
/*
 *  TODO: Vectors as arguments
 *  @example
 *    var vec1 = new b.Vector( x1, y1 );
 *    var vec2 = new b.Vector( x2, y2 );
 *    b.line( vec1, vec2 );
 */
pub.line = function(x1, y1, x2, y2) {
  if (arguments.length !== 4) {
    error("b.line(), not enough parameters to draw a line! Use: x1, y1, x2, y2");
  }
  var lines = currentPage().graphicLines;
  var newLine = lines.add(currentLayer());
  newLine.strokeWeight = currStrokeWeight;
  newLine.strokeTint = currStrokeTint;
  newLine.fillColor = currFillColor;
  newLine.fillTint = currFillTint;
  newLine.strokeColor = currStrokeColor;
  newLine.paths.item(0).entirePath = [[x1, y1], [x2, y2]];
  newLine.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                   AnchorPoint.CENTER_ANCHOR,
                   currMatrix.adobeMatrix());
  return newLine;
};

/**
 * Using the beginShape() and endShape() functions allow creating more complex forms.
 * beginShape() begins recording vertices for a shape and endShape() stops recording.
 * After calling the beginShape() function, a series of vertex() commands must follow.
 * To stop drawing the shape, call endShape(). The value of the parameter tells whether the paths to
 * create from the provided vertices have to be closed or not (to connect the beginning and the end).
 *
 * @cat Document
 * @subcat Primitives
 * @method beginShape
 * @param {String} shapeMode Set tob.CLOSE if the new Path should be auto-closed.
 */
pub.beginShape = function(shapeMode) {
  currVertexPoints = [];
  currPathPointer = 0;
  currPolygon = null;
  if(typeof shapeMode != null) {
    currShapeMode = shapeMode;
  } else {
    currShapeMode = null;
  }
};

/**
 * Shapes are constructed by connecting a series of vertices. vertex() is used to
 * specify the vertex coordinates lines and polygons. It is used exclusively within
 * the beginShape() and endShape() functions.
 *
 * Please use either vertex(x, y) or
 * for drawing bezier shapes vertex(x, y, xAnchorLeft, yAnchorLeft, xAnchorRight, yAnchorRight).
 * You can also mix the two approaches.
 *
 * @cat Document
 * @subcat Primitives
 * @method vertex
 * @param  {Number} x X-coordinate of the vertex.
 * @param  {Number} y Y-coordinate of the vertex.
 * @param  {Number} [xAnchorLeft] X-coordinate of the left-direction point.
 * @param  {Number} [yAnchorLeft] Y-coordinate of the left-direction point.
 * @param  {Number} [xAnchorRight] X-coordinate of the right-direction point.
 * @param  {Number} [yAnchorRight] Y-coordinate of the right-direction point.
 */
pub.vertex = function() {
  if (isArray(currVertexPoints)) {
    if (arguments.length === 2) {
      currVertexPoints.push([arguments[0], arguments[1]]);
    } else if (arguments.length === 6) {
      // [[xL1, YL1], [x1, y1], [xR1, yR1]]
      currVertexPoints.push([[arguments[2], arguments[3]],
                              [arguments[0], arguments[1]],
                              [arguments[4], arguments[5]]]);
    } else {
      error("b.vertex(), wrong argument count: Please use either vertex(x, y) or vertex(x, y, xAnchorLeft, yAnchorLeft, xAnchorRight, yAnchorRight)!");
    }
  } else {
    notCalledBeginShapeError();
  }
};

/**
 * The arc() function draws an arc in the display window.
 * Arcs are drawn along the outer edge of an ellipse defined by the
 * <b>x</b>, <b>y</b>, <b>width</b> and <b>height</b> parameters.
 * The origin or the arc's ellipse may be changed with the
 * <b>ellipseMode()</b> function.
 * The <b>start</b> and <b>stop</b> parameters specify the angles
 * at which to draw the arc.
 *
 * @cat Document
 * @subcat Primitives
 * @method arc
 * @param {Number} cx X-coordinate of the arc's center.
 * @param {Number} cy Y-coordinate of the arc's center.
 * @param {Number} w Width of the arc's ellipse.
 * @param {Number} h Height of the arc's ellipse.
 * @param {Number} startAngle Starting angle of the arc in radians.
 * @param {Number} endAngle Ending angle of the arc in radians.
 * @param {String} [mode] Mode to define the rendering technique of the arc: b.OPEN (default), b.CHORD, or b.PIE.
 *
 * @return {GraphicLine|Polygon} The resulting GraphicLine or Polygon object (in InDesign Scripting terms the corresponding type is GraphicLine or Polygon, not Arc).
 *
 * TODO(S)
 * - fix overlapping points bug
 */
pub.arc = function(cx, cy, w, h, startAngle, endAngle, mode) {
  if (w <= 0 || endAngle < startAngle) {
    return false;
  }
  if (arguments.length < 6) error("b.arc(), not enough parameters to draw an arc! Use: x, y, w, h, startAngle, endAngle");

  var o = b.radians(1); // add 1 degree to ensure angles of 360 degrees are drawn
  startAngle %= pub.TWO_PI + o;
  endAngle %= pub.TWO_PI + o;
  w /= 2;
  h /= 2;

  if (currEllipseMode === pub.CORNER) {
    cx = (cx - w);
    cy = (cy + h);
  }
  else if (currEllipseMode === pub.CORNERS) {
    // cx = (cx-w);
    // cy = (cy-h);
    // w -= cx;
    // h -= cy;
  }
  else if (currEllipseMode === pub.RADIUS) {
    w *= 2;
    h *= 2;
  }

  var delta = pub.abs(endAngle - startAngle);
  var direction = (startAngle < endAngle) ? 1 : -1;
  var thetaStart = startAngle;

  if(mode == pub.CHORD) {
    pub.beginShape(pub.CLOSE);
  }
  else if(mode == pub.PIE) {
    pub.beginShape(pub.CLOSE);
    pub.vertex(cx, cy);
  }
  else {
    pub.beginShape();
  }
  for (var theta = pub.min(pub.TWO_PI, delta); theta > pub.EPSILON;) {
    var thetaEnd = thetaStart + direction * pub.min(theta, pub.HALF_PI);
    var points = calculateEllipticalArc(w, h, thetaEnd, thetaStart);

    pub.vertex(
      cx + points.startx,
      cy + points.starty,
      cx + points.startx,
      cy + points.starty,
      cx + points.handle1x,
      cy + points.handle1y
    );
    pub.vertex(
      cx + points.endx,
      cy + points.endy,
      cx + points.handle2x,
      cy + points.handle2y,
      cx + points.endx,
      cy + points.endy
    );

    theta -= pub.abs(thetaEnd - thetaStart);
    thetaStart = thetaEnd;
  }
  return pub.endShape();
};

/*
 * Cubic bezier approximation of a eliptical arc
 *
 * intial source code:
 * Golan Levin
 * golan@flong.com
 * http://www.flong.com/blog/2009/bezier-approximation-of-a-circular-arc-in-processing/
 *
 * The solution is taken from this PDF by Richard DeVeneza:
 * http://www.tinaja.com/glib/bezcirc2.pdf
 * linked from this excellent site by Don Lancaster:
 * http://www.tinaja.com/cubic01.asp
 *
 */
function calculateEllipticalArc(w, h, startAngle, endAngle) {
  var theta = (endAngle - startAngle);

  var x0 = pub.cos(theta / 2.0);
  var y0 = pub.sin(theta / 2.0);
  var x3 = x0;
  var y3 = 0 - y0;
  var x1 = (4.0 - x0) / 3.0;
  var y1 = ((1.0 - x0) * (3.0 - x0)) / (3.0 * y0);
  var x2 = x1;
  var y2 = 0 - y1;

  var bezAng = startAngle + theta / 2.0;
  var cBezAng = pub.cos(bezAng);
  var sBezAng = pub.sin(bezAng);

  return {
    startx:   w * (cBezAng * x0 - sBezAng * y0),
    starty:   h * (sBezAng * x0 + cBezAng * y0),
    handle1x: w * (cBezAng * x1 - sBezAng * y1),
    handle1y: h * (sBezAng * x1 + cBezAng * y1),

    handle2x: w * (cBezAng * x2 - sBezAng * y2),
    handle2y: h * (sBezAng * x2 + cBezAng * y2),
    endx:     w * (cBezAng * x3 - sBezAng * y3),
    endy:     h * (sBezAng * x3 + cBezAng * y3)
  };
}

/**
 * addPath() is used to create multi component paths. Call addPath() to add the so far drawn vertices to a single path.
 * New vertices will then end up in a new path. endShape() will then return a multi path object. All component paths will account for
 * the setting (see b.CLOSE) given in beginShape(shapeMode).
 *
 * @cat Document
 * @subcat Primitives
 * @method addPath
 */
pub.addPath = function() {
  doAddPath();
  currPathPointer++;
};

/**
 * The endShape() function is the companion to beginShape() and may only be called
 * after beginShape().
 *
 * @cat Document
 * @subcat Primitives
 * @method endShape
 * @return {GraphicLine|Polygon} The GraphicLine or Polygon object that was created.
 */
pub.endShape = function() {
  doAddPath();
  currPolygon.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                   AnchorPoint.TOP_LEFT_ANCHOR,
                   currMatrix.adobeMatrix());
  return currPolygon;
};

function doAddPath() {
  if (isArray(currVertexPoints)) {
    if (currVertexPoints.length > 0) {

      if(currPolygon === null) {
        addPolygon();
      } else {
        currPolygon.paths.add();
      }

      currPolygon.paths.item(currPathPointer).entirePath = currVertexPoints;
      currVertexPoints = [];
    }
  } else {
    notCalledBeginShapeError();
  }
}

function addPolygon() {
  if (currShapeMode === pub.CLOSE) {
    currPolygon = currentPage().polygons.add(currentLayer());
  } else {
    currPolygon = currentPage().graphicLines.add(currentLayer());
  }

  currPolygon.strokeWeight = currStrokeWeight;
  currPolygon.strokeTint = currStrokeTint;
  currPolygon.fillColor = currFillColor;
  currPolygon.fillTint = currFillTint;
  currPolygon.strokeColor = currStrokeColor;
}


function notCalledBeginShapeError () {
  error("b.endShape(), you have to call first beginShape(), before calling vertex() and endShape()");
}

/**
 * Draws a rectangle on the page.
 *
 * @cat Document
 * @subcat Primitives
 * @method rect
 * @param  {Number} x X-coordinate of the rectangle.
 * @param  {Number} y Y-coordinate of the rectangle.
 * @param  {Number} w Width of the rectangle.
 * @param  {Number} h Height of the rectangle.
 * @return {Rectangle} The rectangle that was created.
 */
pub.rect = function(x, y, w, h) {
  if (w === 0 || h === 0) {
    // indesign doesn't draw a rectangle if width or height are set to 0
    return false;
  }
  if (arguments.length !== 4) error("b.rect(), not enough parameters to draw a rect! Use: x, y, w, h");

  var rectBounds = [];
  if (currRectMode === pub.CORNER) {
    rectBounds[0] = y;
    rectBounds[1] = x;
    rectBounds[2] = (y + h);
    rectBounds[3] = (x + w);
  } else if (currRectMode === pub.CORNERS) {
    rectBounds[0] = y;
    rectBounds[1] = x;
    rectBounds[2] = h;
    rectBounds[3] = w;
  } else if (currRectMode === pub.CENTER) {
    rectBounds[0] = y - (h / 2);
    rectBounds[1] = x - (w / 2);
    rectBounds[2] = (y + h) - (h / 2);
    rectBounds[3] = (x + w) - (w / 2);
  }

  var newRect = currentPage().rectangles.add(currentLayer());
  newRect.geometricBounds = rectBounds;
  newRect.strokeWeight = currStrokeWeight;
  newRect.strokeTint = currStrokeTint;
  newRect.fillColor = currFillColor;
  newRect.fillTint = currFillTint;
  newRect.strokeColor = currStrokeColor;

  if (currRectMode === pub.CENTER) {
    newRect.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                       AnchorPoint.CENTER_ANCHOR,
                       currMatrix.adobeMatrix());
  } else {
    newRect.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                   AnchorPoint.TOP_LEFT_ANCHOR,
                   currMatrix.adobeMatrix());
  }
  return newRect;
};


// -- Attributes --

/**
 * Modifies the location from which rectangles draw. The default mode is
 * rectMode(CORNER), which specifies the location to be the upper left
 * corner of the shape and uses the third and fourth parameters of rect()
 * to specify the width and height. The syntax rectMode(CORNERS) uses the
 * first and second parameters of rect() to set the location of one corner
 * and uses the third and fourth parameters to set the opposite corner.
 * The syntax rectMode(CENTER) draws the image from its center point and
 * uses the third and forth parameters of rect() to specify the image's
 * width and height. The syntax rectMode(RADIUS) draws the image from its
 * center point and uses the third and forth parameters of rect() to specify
 * half of the image's width and height. The parameter must be written in
 * "ALL CAPS".
 *
 * @cat Document
 * @subcat Attributes
 * @method rectMode
 * @param {String} mode The rectMode to switch to: either b.CORNER, b.CORNERS, b.CENTER, or b.RADIUS.
 *
 */
pub.rectMode = function (mode) {
  if (arguments.length === 0) return currRectMode;
  if (mode === pub.CORNER || mode === pub.CORNERS || mode === pub.CENTER) {
    currRectMode = mode;
    return currRectMode;
  } else {
    error("b.rectMode(), unsupported rectMode. Use: CORNER, CORNERS, CENTER.");
  }
};

/**
 * The origin of the ellipse is modified by the ellipseMode() function.
 * The default configuration is ellipseMode(CENTER), which specifies the
 * location of the ellipse as the center of the shape. The RADIUS mode is
 * the same, but the width and height parameters to ellipse() specify the
 * radius of the ellipse, rather than the diameter. The CORNER mode draws
 * the shape from the upper-left corner of its bounding box. The CORNERS
 * mode uses the four parameters to ellipse() to set two opposing corners
 * of the ellipse's bounding box. The parameter must be written in "ALL CAPS".
 *
 * @cat Document
 * @subcat Attributes
 * @method ellipseMode
 * @param {String} mode The ellipse mode to switch to: either b.CENTER, b.RADIUS, b.CORNER, or b.CORNERS.
 */
pub.ellipseMode = function (mode) {
  if (arguments.length === 0) return currEllipseMode;
  if (mode === pub.CORNER || mode === pub.CORNERS || mode === pub.CENTER || mode === pub.RADIUS) {
    currEllipseMode = mode;
    return currEllipseMode;
  } else {
    error("b.ellipseMode(), Unsupported ellipseMode. Use: CENTER, RADIUS, CORNER, CORNERS.");
  }
};

/**
 * Sets the width of the stroke used for lines and the border
 * around shapes.
 *
 * @cat Document
 * @subcat Attributes
 * @method strokeWeight
 * @param {Number} weight The width of the stroke in points.
 */
pub.strokeWeight = function (weight) {
  if (typeof weight === "string" || typeof weight === "number") {
    currStrokeWeight = weight;
  } else {
    error("b.strokeWeight, not supported type. Please make sure the strokeweight is a number or string");
  }
};

/**
 * Returns the object style of a given page item or the object style with the given name. If an
 * object style of the given name does not exist, it gets created. Optionally a props object of
 * property name/value pairs can be used to set the object style's properties.
 *
 * @cat Typography
 * @method objectStyle
 * @param  {PageItem|String} itemOrName A page item whose style to return or the name of the object style to return.
 * @param {Object} [props] An object of property name/value pairs to set the style's properties.
 * @return {ObjectStyle} The object style instance.
 */
pub.objectStyle = function(itemOrName, props) {
  var styleErrorMsg = "b.objectStyle(), wrong parameters. Use: pageItem|name and props. Props is optional.";

  if(!arguments || arguments.length > 2) {
    error(styleErrorMsg);
  }

  var style;
  if(itemOrName.hasOwnProperty("appliedObjectStyle")) {
    // pageItem is given
    style = itemOrName.appliedObjectStyle;
  } else if(isString(itemOrName)) {
    // name is given
    style = findInStylesByName(currentDoc().allObjectStyles, itemOrName);
    if(!style) {
      style = currentDoc().objectStyles.add({name: itemOrName});
    }
  } else {
    error(styleErrorMsg);
  }

  if(props) {
    try {
      style.properties = props;
    } catch (e) {
      error("b.objectStyle(), wrong props parameter. Use object of property name/value pairs.");
    }
  }

  return style;
};

/**
 * Applies an object style to the given page item. The object style can be given as
 * name or as an object style instance.
 *
 * @cat Typography
 * @method applyObjectStyle
 * @param  {PageItem} item The page item to apply the style to.
 * @param {ObjectStyle|String} style An object style instance or the name of the object style to apply.
 * @return {PageItem} The page item that the style was applied to.
 */

pub.applyObjectStyle = function(item, style) {

  if(isString(style)) {
    var name = style;
    style = findInStylesByName(currentDoc().allObjectStyles, name);
    if(!style) {
      error("b.applyObjectStyle(), an object style named \"" + name + "\" does not exist.");
    }
  }

  if(!(item.hasOwnProperty("appliedObjectStyle")) || !(style instanceof ObjectStyle)) {
    error("b.applyObjectStyle(), wrong parameters. Use: pageItem, objectStyle|name");
  }

  item.appliedObjectStyle = style;

  return item;
};

/**
 * Duplicates the given page after the current page or the given pageitem to the current page and layer. Use b.rectMode() to set center point.
 *
 * @cat Document
 * @subcat Transformation
 * @method duplicate
 * @param {PageItem|Page} item The page item or page to duplicate.
 * @returns {Object} The new page item or page.
 */
pub.duplicate = function(item) {

  if(!(item instanceof Page) && typeof (item) !== "undefined" && item.hasOwnProperty("duplicate")) {

    var newItem = item.duplicate(currentPage());
    newItem.move(currentLayer());

    if (currRectMode === pub.CENTER) {
      newItem.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                       AnchorPoint.CENTER_ANCHOR,
                       currMatrix.adobeMatrix());
    } else {
      newItem.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
                     AnchorPoint.TOP_LEFT_ANCHOR,
                     currMatrix.adobeMatrix());
    }

    return newItem;

  } else if(item instanceof Page) {

    var newPage = item.duplicate(LocationOptions.AFTER, pub.page());
    return newPage;

  } else {
    error("Please provide a valid Page or PageItem as parameter for duplicate().");
  }

};
