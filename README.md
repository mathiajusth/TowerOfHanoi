# towerOfHanoi includes
- functionality of tower of hanoi game
- means for rendering in browser ("display" object)

# concepts used
	 - CLOSURES ~ creating private states and functions 
	 		(e.g.: 'path' in 'getSolutionPath')
	 			  ~ not polluting global variable namespace (the whole 'towerOfHanoiGame.js' module)
	 - TYPE AUGUMENTATION ~ New Number & Array methods in Pre-requsites section of code
	 - CASCADING ~ Hanoi method 'moveBlock' returns the Hanoi after the block movement enabling
	 		expressions as: Hanoi.moveBlock(0,2).moveBlock(0,1).moveBlock(2,1).moveBlock(0,2).moveBlock(1,0).moveBlock(1,2).moveBlock(0,2)
	 - LOGIC OPERATORS ~ the behaviour of '&&' and '||' and truthyness/falsiss of objects
	 - RECURSION ~ hanoi solver 'getSolutionPath'
	 - MEMOIZATION ~ memoized Hanoi solver 'getSolutionPath_memoized'
   - LAMBDA/ARROW FUNCTIONS ~ in 'mutatePath' funtion
	 - PERFORMANCE TESTING - 'performance' and 'meanPerformance' Function type augumentations (can be used to tset performance of 'getSolutionPath' functions)
	 		Example:
	 			h = makeHanoi(20);
	 			h.getSolutionPath.meanPerformance([])(1); // ~> 602.8000000000002
	 			h.getSolutionPath_memoized.meanPerformance([])(1) // ~> 1480.1949999999924
	 		First iteration of memoized solver is slower, but solution being stored in private state makes the difference in consecutive calls
	 			h.getSolutionPath_memoized.meanPerformance([])(1) // ~>  0.010000000009313226
	 		Memoization is not useful in this particular case because thew solution needs to be computed only once for each Hanoi,
	 		it is only meant to demosntrate the principle of memoization
