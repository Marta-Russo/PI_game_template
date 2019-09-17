# PAIRS project games  

The project is a transition of MATLAB PAIRS games implementation into js ES6 canvas (HMTL). Lookit platform is used as a study delivery environment for data collection, participant management and questionnaires.

### Current state 
The game is close functionally to the MATLAB implementation and functions well in the Lookit environment. Initial graphics from MATLAB was replaced with appropriate images for older children population.
To avoid possible inconsistencies and preserve the history of implementation and hence better readability, the object positions calculations and constants left the same as in MATLAB, which might look as lack of sufficiency in the codebase.

### Where to start with Lookit 
Use the resources below to understand :
- [How study structure could be created with ember templates](https://lookit.readthedocs.io/en/develop/researchers-create-experiment.html#experiment-structure)
- [Lookit stack structure](https://lookit.readthedocs.io/en/develop/install-django-project.html)
- [Frameplayer structure](https://lookit.readthedocs.io/en/develop/install-ember-app.html)
- [How to create a new frame](https://lookit.readthedocs.io/en/develop/frame-dev-creation.html)
- [How to deploy the template in local environment]()


### Possible development process organization

1. To avoid delays caused by Lookit compilation time you could use [minimal environment for game development](https://github.com/elcrion/PI_game_template).
2. After major changes are done, the game should be deployed to the [exp-lookit-games](https://github.com/elcrion/ember-lookit-frameplayer/tree/develop) 
3. Test in local [docker environment](https://github.com/elcrion/PI_docker)
4. If everything works, the game can be deployed to [Lookit staging server](https://staging-lookit.cos.io) for further testing by research group

Remember to keep develop branch up to date with upstream [ember-lookit-frameplayer](https://github.com/lookit/ember-lookit-frameplayer)
     
### Code structure 
Base class exposes main game logic for all games: 
- loop() : main game loop to clear canvas and redraw game objects , pretty much all the current trial  logic is implemented here
- dataCollection(): data collection loop with set frequency (currently 33 HZ). 
- finishGame() : end current trial, make sure no trials left, sends the data to lookit server 
- initGame() : mathod called on every new trial , all the trial objects could be restored here to initial conditions
- onMouseMove() : current cursor pointer setter for all games
- various methods calculating initial parameters and trajectory


Game implementation class: 
- init() : method where all the initial game parameters initialized
- initGame() : see base class 
- loop() : see base class 
- dataCollection(): see base class 

Utils class : Contains static values for media resources used in games


For object schema, build the documentation for component with [YUIdoc](https://lookit.readthedocs.io/en/develop/frame-dev-creation.html#documenting-your-frame)

### Game aspect ratio 
Current implementation took aspect ratio 1024 : 768  (4:3) from Matlab version to preserve object sizes and distances with current scaling factor (420).  To partially overcome this ,  calculateCanvas method in Base class is trying to stretch the canvas height or width to full screen and recalculate the scaling factor appropriately.

###  Important resources
* [Lookit Platform Docs](https://lookit.readthedocs.io/en/develop/frame-dev.html) - Lookit platform documentation
* [Lookit Docker environment ](https://github.com/elcrion/PI_docker) - Use for local testing of created Ember component before shipping to staging server
* [Ember-lookit GitHub](https://github.com/elcrion/ember-lookit-frameplayer) - Current PAIRS Lookit Ember implementation.

### Todos
Further possible enhancement once game logic solidified : 
- Possibly set better abstraction for current classes. For example paddle games might extend appropriate behavior as a separate interface or abstract class.
- Possibly pass resources to game through Lookit ember component instead of current Utils class 
- Canvas might have nested architecuture for static objects. Right now all the objects are redrawn on every update like it is in Matlab implementation.
- Refactor visual objects position and dimensions 



### Math used in games
#### Initial game trajectory parameters 
##### Feed the crocodile game : 

```
Initial parameters set : 
Time flight : 0.75  (seconds)
Initial height: 0.65 (pixel value before scaling)  
Actual height parameters are calculated from the Initial height by multiplying the  uniformly randomized  values in  vector (1, 5)
```
Height calculation : 

![equation](https://i.ibb.co/vZzbY1T/render-2.png)


Gravity : 

![equation](https://i.ibb.co/SdK51QX/render-3.png)


```
ballvx = 1.051 / Tf 
initV = 0.5 * GravityVector * Tf
initX = 0.52 
initBallY = 0 
```

#### Basic trajectory equation:
positionX =  initX + ballvx * t 
```
t : time parameter in seconds (usually decimals like : 0.001 ..)
initX : initial X position of the ball  in pixels, scaled to the actual position via Scaling factor
ballvx : current ball velocity on X axis 
initBallY : initial Y position of the ball  in pixels, scaled to the actual position via Scaling factor 
initV: initial velocity on y axis 
g : gravity 
````
![equation](https://i.ibb.co/TM0rXzR/render-4.png)
```
t : time parameter in seconds (usually decimals like : 0.001 ..)
initX : initial X position of the ball  in pixels, scaled to the actual position via Scaling factor
ballvx : current ball velocity on X axis 
initBallY : initial Y position of the ball  in pixels, scaled to the actual position via Scaling factor 
initV: initial velocity on y axis 
g : gravity 
```

#### Bounce trajectory : 
##### Release velocity calculation : 
RV = -alpha * (ball_velocity - paddleVelocity) + paddleVelocity

```
alpha : restitute factor = 0.7
ball_velocity  =   initV  -  gravity *  t  , where t is the time since start of the trajectory 
paddleVelocity  :  calculated from 9 past  vector values of paddle y coordinates (in pixel values)  and time in seconds
````
##### Paddle Velocity calculation: 

![equation](https://i.ibb.co/878fL5W/render.png)
```
t : current time lapse in seconds, p : position of paddle on y axis
```  

#### Catch the cheese game 

```
Height : 0.8 
Time Flight : 0.8
```
#### Feed the Mouse in the house

```
Time Flight is the uniformly distributed array of values : 0.8, 0.9 , 1 
Height : 0.8
initX = 0.751
Gravity = 2*Height / (Tf*Tf)
ballvx = (1.051)/Tf
initV = Gravity*Tf/2
```

#### Feed 3 mice

```
Tf : 0.9
Gravity : 1.8
ballvx = (1.051)/Tf
initX = 0.7510
initBallY = -0.02
velocity_matrix : uniformly distributed matrix of initial  values : 1,2,3 
initV: vector value  = 0.15 * velocity_matrix + 0.45 
```






