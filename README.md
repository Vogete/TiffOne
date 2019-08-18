# TiffOne

A small browser extension that displays TIFF (*.tiff) files (especially [AlternaTIFF](http://www.alternatiff.com/) objects) with support for multi-page TIFF files.

This project started as a replacement for [AlternaTIFF](http://www.alternatiff.com/), which is an ActiveX extension that has been removed from modern browsers, and only works in Internet Explorer, which is also obsolete at this point. However, lots of corporate environments still use AlternaTIFF, forcing users to use IE. TiffOne is the solution for this problem, with a very similar UI to AlternaTIFF, but working in Google Chrome.

TiffOne uses [tiff.js](https://github.com/seikichi/tiff.js) for converting TIFF files to HTML canvases.
All images are displayed inline, at their original size, but with a small header added for page navigation, and other functions.

This is a one-man project so far, so anyone is more than welcome to contribute to this tool in any way!
