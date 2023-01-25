# phantom

Hi, thanks for taking a look at my submission! [Please click here to access it.](https://oscarsaharoy.github.io/phantom)

I think the concept is really cool and had a good time working with all the AI tools :) My submission is a story in the form of stills from an 80s movie/sitcom. It's a bit better on desktop than mobile if possible.

The images are all made using [dreamstudio](https://beta.dreamstudio.ai/dream) and a lot of trial and error in the prompting.

Then the depth maps come from MiDaS, [I modified the provided colab notebook to be able to upload your own images](https://colab.research.google.com/drive/14YPZrFaw8PbBgsjFJHXp9zoSa0vfZsCK?usp=sharing)

The app is just plain js/css/html + threejs and obviously isn't as polished as I would like. I think the shader could be improved a lot too; it would be cool to do some transformation of the images maybe involving inpainting of occluded areas to improve the depth rendering. I have also noticed that some types of images work way better for this, especially the last 2 in my slideshow, so it would be good to try to focus on similar ones.

