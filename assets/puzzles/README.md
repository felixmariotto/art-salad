# If you want to add a puzzle, please read on !

To ensure a consistent user experience and an easy maintenance, puzzles models and information must match some standards. The following will explain all you need to know to make sure your puzzle can be added to the museum.

## Type of model

Art Salad wants to be an interactive museum, were you can have fun *and* learn at the same time, therefore it is absolutely critical that the model be as faithful to the original piece of art as possible. A 3D scan of good quality is preffered compared to a reproduction even if the latter looks better, because reproduction adds information that wasn't on the original piece of art.

There is no limitation as to the era, type, subject, or style of piece of art.

## License

The 3D model must have a license allowing people to use it for free.
Since model authors are always credited, you can use model with a CC Attribution license.
Copy the license file in the same folder as your model. [example](https://github.com/felixmariotto/art-salad/blob/master/assets/puzzles/hydria-vase/license.txt)

## Technical specifications

The lowest supported device of this application is the Oculus Quest 1 (untethered), which is really not powerful. It is necessary to make some serious trade-offs to support such hardware.
- ***Maximum triangle count:*** 400,000. Since models are hosted on the repository with Github LFS, please don't use 400,000 when not necessary.
- ***Material:*** Only basic materials are supported, so in Blender you can directly connect the texture to the material output:
![Screenshot 2022-08-28 220316](https://user-images.githubusercontent.com/46470486/187092398-306b4e67-4e2f-4052-b5d5-8977dfd93d46.jpg)    
If you want lights and shadows on the surface of your model, bake them on the texture.
- ***Texture:*** resolution 4096x4096 maximum. Less is allowed but not recommanded, and the image must be square with a length power of two (2048, 1024...)

## Gameplay considerations

Split the puzzle in parts so it's fun to assemble back. If there is a recognizable feature somewhere, split it so players can notice it on two different pieces and try to assemble them. The number of parts to make from your model depends on the level of details. A big brutalist building without many features will not be fun if there is too many parts with no feature to differentiate them, whereas a very intricate ornamented reliquary is a good opportunity to make lots of pieces with their own recognizable features. As a rule of thumb, very simple shape 15 parts, very complexe shape 100 parts. Don't make over 100 parts, because of technical limitations (draw calls).

## Test it locally before to submit
