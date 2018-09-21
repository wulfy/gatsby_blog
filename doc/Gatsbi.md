# Gatsbi doc

A doc to explain and list what I understood about Gatsbi and how I adapt it for my blog.

## Static folder
Contain file which will be copy/past to public folder after build.
Use it when you can't use webpack to minify and hash them.
In my project, I put CSS files because all effects are not easy to define in a JS react way.
So I use className in react components and this file is used to do avanilla CSS implementation (dirty but fast :)) 	