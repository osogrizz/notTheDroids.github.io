Physics(function(world){
    var gameWidth = 1280;
    var gameHeight = 580;

    var renderer = Physics.renderer('canvas', {
        el: 'gameView',
        width: gameWidth,
        height: gameHeight,
        meta: false, // don't display meta data
        styles: {
            // set colors for the circle bodies
            'circle' : {
                strokeStyle: 'hsla(60, 37%, 57%, 0.8)',
                lineWidth: 1,
                fillStyle: 'hsla(60, 37%, 57%, 0.8)',
                angleIndicator: '#351024'
            },
            'rectangle' : {
              fillStyle: 'hsla(60, 37%, 57%, 0.8)',
            }
        }
    });





    // add the renderer
    world.add( renderer );
        // render on each step
        world.on('step', function(){
        world.render();
    });

    // bounds of the window
    var gameViewBounds = Physics.aabb(0, 0, gameWidth, gameHeight);

    // constrain objects to these bounds
    // world.add(Physics.behavior('edge-collision-detection', {
    //     aabb: gameViewBounds,
    //     restitution: 0,
    //     cof: 0,

    // }));

   

   // this creates a new body (craft).

   craft = Physics.body('circle', {
       x:250,
       y:250,
       radius:45,
       label: 'craft',
       uid: 1,

   });

    // then I attach an img file to the crated body.

    craft.view = new Image();
    craft.view.src = 'Tie-Fighter-01-icon.png';
    world.add(craft);

    
    // window.setInterval ( function() {target, x,y, { 

    var target = Physics.body( 'circle', {
        x: 1230,
        y: 250,
        // gives body a direction and speed.
        vx: -0.1,
        vy: 0.001,
        radius: 45,
        label: 'target',
        uid: 2,
        // treatment 'kinematic' allows body to pass through the game world walls.
        treatment: 'kinematic', 
        styles: {
            fillstyle: 'hsla(60, 37%, 57%, 0.8)',
            lineWidth: 1
        }
      
    }); 

    target.view = new Image();
    target.view.src = 'http://rs638.pbsrc.com/albums/uu108/Sin_Nir_Endo/SW_DoD_Jawa_4-10.png~c200';
    world.add(target);

    var shouldBeRemoved = Physics.query({
        label:{$in: ['bullet','target', 'craft']}
    });

    

    


    // ensure objects bounce when edge collision is detected
    // world.add(Physics.behavior('constant-acceleration'));

    world.add(Physics.behavior('body-impulse-response'));

    world.add(Physics.behavior('body-collision-detection'));

    world.add(Physics.behavior('sweep-prune'));

  
    
    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time, dt ){
        world.step( time );
    });

    var lasers = new Audio(src="http://www.sa-matra.net/sounds/starwars/TIE-Fire.wav");

    
    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 83) {
            world.emit('fire');
            lasers.play();
        } else if (event.keyCode === 37) {
            world.emit('move', 'left');
        } else if (event.keyCode == 39) {
            world.emit('move', 'right');
        } else if (event.keyCode === 38) {
            world.emit('move', 'up');
        }else if (event.keyCode === 40) {
            world.emit('move', 'down');
        }
    });

    // start the ticker
    Physics.util.ticker.start();


    // this allows me to only create blasters on a keydown event.
    

    world.on('fire', function(data,e) {

 	

 	var blasters = Physics.body('rectangle', {

        // I get the position of the craft object ,then offset it so that it doesnt collide on creation.
         x: craft.state.pos.x + 100,
         y: craft.state.pos.y + 10,
         vx: 0.9,
         vy: 0.0,
         mass: 2,
         height: 4,
         width: 30,
         restitution: 0.99,
         angularVelocity: 0.00001,
         label: 'bullet',
         uid: 3,
         styles: {
            fillStyle: 'green',
            lineWidth: 0,
            

        }

    });

 	

    world.add(blasters);
      

    });






//  Reconfigured move keys based on example code. This now includes 'up' 'down' functionality.


    world.on('move', function(data, e) {

    	//case stmt left/right/down/up

    	if (data === 'left') {
    		craft.state.pos.set(craft.state.pos.x + (-40), craft.state.pos.y);
    	} else if(data === 'right') {
    		craft.state.pos.set(craft.state.pos.x + (40), craft.state.pos.y);
    	} else if (data === 'up') {
    		craft.state.pos.set(craft.state.pos.x , craft.state.pos.y + (-40));
    	} else if (data === 'down') {
    		craft.state.pos.set(craft.state.pos.x, craft.state.pos.y + (40));
    	}


    });


        // collision detection for blaster fire against any object.
    world.on('collisions:detected', function(data, e) {    
        
        var targetXplode = Physics.body('circle', {

            x: target.state.pos.x  ,
            y: target.state.pos.y ,
            label: 'targetXplode',
            treatment: 'kinematic', 
      
        // Timeout function to remove xplode effect/body shorly after creation.
     
        
    });

         
        targetXplode.view = new Image();
        targetXplode.view.src = 'http://flashvhtml.com/html/img/action/explosion/Explosion_Sequence_A%2012.png';
       
        var craftXplode = Physics.body('circle', {

            x: craft.state.pos.x,
            y: craft.state.pos.y,
            label: 'craftXplode',
            treatment: 'kinematic', 
      
        // Timeout function to remove xplode effect/body shorly after creation.     
            
    });

    craftXplode.view = new Image();
    craftXplode.view.src = 'http://flashvhtml.com/html/img/action/explosion/Explosion_Sequence_A%2012.png';


        if (shouldBeRemoved( data.collisions[0].bodyA )) {
            world.removeBody( data.collisions[0].bodyA );
            world.add(targetXplode);
            $('#score').text('Score : ' + 500);
            console.log(data.collisions[0]);
        } if (shouldBeRemoved(data.collisions[0].bodyA )) {
            world.removeBody( data.collisions[0].bodyB);
            // $('#life:last-child' ).remove( );
            

        // } if (shouldBeRemoved(data.collisions[0].bodyB)) {
        //     world.removeBody(data.collisions[0].bodyB);

        
        } 


    });

    





});