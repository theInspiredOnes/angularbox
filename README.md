angularbox
==========

A lightbox module for AngularJS. The module has no external dependencies besides Angular itself. **No jQuery required**. So far, it only supports displaying images in a lightbox.
Check out the example [here](http://theinspiredones.github.io/angularbox/build/index.html).

## Usage
Just include Angular and the `angularbox.min.js` in your page and add this at the very bottom just before the closing `</body>` tag:

`<div data-angularbox="angularbox"></div>`

Links to images that should open in a lightbox are referenced like this: 

```
<a href="http://lorempixel.com/1000/500/people/1" class="angularbox" title="Title goes here">
  <img src="http://lorempixel.com/200/200/people/1" alt="Foo width="200">
</a>
```

Different galleries can be created by adding a `rel="mygalleryname"` to the `<a>` tag.

**Known Issues**
- Zooming behaviour on mobile devices.


**Contribute**

You need to have grunt and bower installed in order to build the code. Grunt is preconfigured with CoffeeScript and LESS compiling. Just run `grunt` or `grunt watch` in the root directory of this repository.
