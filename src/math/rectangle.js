// namespaces
var dwv = dwv || {};
dwv.math = dwv.math || {};

/**
 * Mulitply the three inputs if the last two are not null.
 *
 * @param {number} a The first input.
 * @param {number} b The second input.
 * @param {number} c The third input.
 * @returns {number} The multiplication of the three inputs or
 *  null if one of the last two is null.
 */
dwv.math.mulABC = function (a, b, c) {
  var res = null;
  if (b !== null && c !== null) {
    res = a * b * c;
  }
  return res;
};

/**
 * Rectangle shape.
 *
 * @class
 * @param {object} begin A Point2D representing the beginning of the rectangle.
 * @param {object} end A Point2D representing the end of the rectangle.
 */
dwv.math.Rectangle = function (begin, end) {
  if (end.getX() < begin.getX()) {
    var tmpX = begin.getX();
    begin = new dwv.math.Point2D(end.getX(), begin.getY());
    end = new dwv.math.Point2D(tmpX, end.getY());
  }
  if (end.getY() < begin.getY()) {
    var tmpY = begin.getY();
    begin = new dwv.math.Point2D(begin.getX(), end.getY());
    end = new dwv.math.Point2D(end.getX(), tmpY);
  }

  /**
   * Get the begin point of the rectangle.
   *
   * @returns {object} The begin point of the rectangle
   */
  this.getBegin = function () {
    return begin;
  };

  /**
   * Get the end point of the rectangle.
   *
   * @returns {object} The end point of the rectangle
   */
  this.getEnd = function () {
    return end;
  };
}; // Rectangle class

/**
 * Check for equality.
 *
 * @param {object} rhs The object to compare to.
 * @returns {boolean} True if both objects are equal.
 */
dwv.math.Rectangle.prototype.equals = function (rhs) {
  return rhs !== null &&
    this.getBegin().equals(rhs.getBegin()) &&
    this.getEnd().equals(rhs.getEnd());
};

/**
 * Get the surface of the rectangle.
 *
 * @returns {number} The surface of the rectangle.
 */
dwv.math.Rectangle.prototype.getSurface = function () {
  var begin = this.getBegin();
  var end = this.getEnd();
  return Math.abs(end.getX() - begin.getX()) *
    Math.abs(end.getY() - begin.getY());
};

/**
 * Get the surface of the circle according to a spacing.
 *
 * @param {number} spacingX The X spacing.
 * @param {number} spacingY The Y spacing.
 * @returns {number} The surface of the rectangle multiplied by the given
 *  spacing or null for null spacings.
 */
dwv.math.Rectangle.prototype.getWorldSurface = function (spacingX, spacingY) {
  return dwv.math.mulABC(this.getSurface(), spacingX, spacingY);
};

/**
 * Get the real width of the rectangle.
 *
 * @returns {number} The real width of the rectangle.
 */
dwv.math.Rectangle.prototype.getRealWidth = function () {
  return this.getEnd().getX() - this.getBegin().getX();
};

/**
 * Get the real height of the rectangle.
 *
 * @returns {number} The real height of the rectangle.
 */
dwv.math.Rectangle.prototype.getRealHeight = function () {
  return this.getEnd().getY() - this.getBegin().getY();
};

/**
 * Get the width of the rectangle.
 *
 * @returns {number} The width of the rectangle.
 */
dwv.math.Rectangle.prototype.getWidth = function () {
  return Math.abs(this.getRealWidth());
};

/**
 * Get the height of the rectangle.
 *
 * @returns {number} The height of the rectangle.
 */
dwv.math.Rectangle.prototype.getHeight = function () {
  return Math.abs(this.getRealHeight());
};

/**
 * Quantify a rectangle according to view information.
 *
 * @param {object} viewController The associated view controller.
 * @returns {object} A quantification object.
 */
dwv.math.Rectangle.prototype.quantify = function (viewController) {
  var quant = {};
  // surface
  var spacing = viewController.get2DSpacing();
  var surface = this.getWorldSurface(spacing[0], spacing[1]);
  if (surface !== null) {
    quant.surface = {value: surface / 100, unit: dwv.i18n('unit.cm2')};
  }

  if (viewController.canQuantifyImage()) {
    // position to pixel for max: extra X is ok, remove extra Y
    var roundEnd = this.getEnd().getRound();
    var max = new dwv.math.Point2D(
      roundEnd.getX(),
      Math.max(0, roundEnd.getY() - 1)
    );
    var subBuffer = viewController.getImageValues(
      this.getBegin().getRound(), max);
    var quantif = dwv.math.getStats(subBuffer);
    quant.min = {value: quantif.getMin(), unit: ''};
    quant.max = {value: quantif.getMax(), unit: ''};
    quant.mean = {value: quantif.getMean(), unit: ''};
    quant.stdDev = {value: quantif.getStdDev(), unit: ''};
  }

  // return
  return quant;
};
