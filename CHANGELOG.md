#### 1.1.0 - Latest release

 - Added alpha shades. Now, instead of only being able to generate 100% opacity shades, transparent black/white shades can also be generated via `generateAlpha` from within `ConsistentShading` instances.

 - Added `rgba` as a result type for `generateAlpha`. It is a tuple of 4 numbers, and is not meant to work with `convert`.

 - Fixed some precision bugs. Shades should be more accurate now.

 - Fixed a bug which caused crashes. If the input type was `lch` the converter would try to convert a type to itself, which is not defined in `color-convert`. 

#### 1.0.0 - 1.0.10

Initial release. Available utilities:

 - `Color` class, useful for conversion.
 - `ConsistentShading` class, the main generator.
     - Instances of this will contain a `generate` function, which will return the list of solid shades that match the given model.