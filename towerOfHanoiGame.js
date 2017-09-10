//========CONCEPTS USED========
	// - CLOSURES ~ creating private states and functions 
	// 		(e.g.: 'path' in 'getSolutionPath')
	// 			  ~ not polluting global variable namespace (the whole 'towerOfHanoiGame.js' module)
	// - TYPE AUGUMENTATION ~ New Number & Array methods in Pre-requsites section of code
	// - CASCADING ~ Hanoi method 'moveBlock' returns the Hanoi after the block movement enabling
	// 		expressions as: Hanoi.moveBlock(0,2).moveBlock(0,1).moveBlock(2,1).moveBlock(0,2).moveBlock(1,0).moveBlock(1,2).moveBlock(0,2)
	// - LOGIC OPERATORS ~ the behaviour of '&&' and '||' and truthyness/falsiss of objects

	// - RECURSION ~ hanoi solver 'getSolutionPath'
	// - MEMOIZATION ~ memoized Hanoi solver 'getSolutionPath_memoized'
	// - LAMBDA/ARROW FUNCTIONS ~ in 'mutatePath' funtion
	// - PERFORMANCE TESTING - 'performance' and 'meanPerformance' Function type augumentations (can be used to tset performance of 'getSolutionPath' functions)
	// 		Example:
	// 			h = makeHanoi(20);
	// 			h.getSolutionPath.meanPerformance([])(1); // ~> 602.8000000000002
	// 			h.getSolutionPath_memoized.meanPerformance([])(1) // ~> 1480.1949999999924
	// 		First iteration of memoized solver is slower, but solution being stored in private state makes the difference in consecutive calls
	// 			h.getSolutionPath_memoized.meanPerformance([])(1) // ~>  0.010000000009313226
	// 		Memoization is not useful in this particular case because thew solution needs to be computed only once for each Hanoi,
	// 		it is only meant to demosntrate the principle of memoization
//=============================

//========TYPE AUGUMENTATIONS========
	// Syntactic sugar for creating object with give prototype i.e.:
	Object.create = function (proto) {
		var Constructor = function() {};
		Constructor.prototype = proto;
		return new Constructor();
	};

	// Syntactic sugar for creating a method 
	// for a givec constructor children i.e.: Number.
	Function.prototype.method = function (methodName,method) {
		this.prototype[methodName] = method;
		return method;
	};

	//isIncreasing :: Array -> Bool
	Array.method('isDecreasingArray',
		function () {
			for (var i = 0; i < this.length-1; i++) {
				if (this[i] < this[i+1]) {
					return false;
				}
			}
			return this;
		}
	);

	// top :: let t be type => [t] -> t
	// Example: [1,2,..,n].top ~> n
	Array.method('top',
		function() {
			return this[this.length - 1];
		}
	);
	//========PERFORMANCE TESTING========
		Function.method('performance', function	(objToApplyTo,arrOfArgs) {
			// Syntax: *function*.performance(*thisOfFunction*, [*arg1*, *arg2*, ...])
			// Example: (Array.prototype.concat).performance([1],[[2,3]]);
			// 	tests the performance time of executing [1].concat([2,3])
			// Note: You can uncomment console.log's to see te result of the tested function and/or
			//	the perforamce time in the console
				var t0 = performance.now();
				var result = this.apply(objToApplyTo,arrOfArgs);
				var t1 = performance.now();
				
				// console.log('The result of performing function is:')
				// console.log(result);
				// console.log('The performance time in milisec is:')
				// console.log(t1 - t0)
				return t1 - t0;
			}
		);

		Function.method('meanPerformance', function (objToApplyTo,arrOfArgs,timesTested) {
			// Syntax: *function*.performance(*thisOfFunction*, [*arg1*, *arg2*, ...], *natural number*)
			// Example: (Array.prototype.concat).performance([1],[[2,3]],10);
			// 	tests the performance time of executing [1].concat([2,3]) *natural number* of times
			//  and returns the arithmetic mean

				sumPerformance = this.performance(objToApplyTo,arrOfArgs);
				for (var i = 1; i < timesTested; i++) {
					sumPerformance = sumPerformance + this.performance(objToApplyTo,arrOfArgs);
				}
				meanPerf = sumPerformance/timesTested;
				return meanPerf;
			}
		);
//===================================

// ========MAIN CODE========
	// ----Data Type for Hanoi Towers game:----
	// Hanoi is Data Type for representing 
	// building blocks on 3 poles
	// as natural numbers in 3 arrays
	// keys of which are 0,1 and 2 in the Hanoi object
	// 
	// Blocks stacked from bottom to top correspond 
	// to numbers in an array from left to right
	// 
	// Block size corresponds to number size
	// 
	// Example - starting position of Hanoi with the tower height of 3 blocks:
	// { 0 : [3,2,1], 
    //   1 : [],
    //   2 : [],
    //   ...some methods
    // }
	// 
	// Recall that a bigger block cannot be put ont a smaller one (i.e. the lists are strictly decreasing)

towerOfHanoiGame = function () {
	var towerOfHanoiGame_module = {};

	var display = {
		cleanSolutionPathOutput : function () {
			document.getElementById('solutionPathOutput').innerHTML = "";
		},
		game : function (hanoi) {
			// Side Effect that displays 'moveBlock' calls to the user
			document.getElementById('hanoiOutput_pole1').innerHTML = '[' + hanoi[0] + ']';
			document.getElementById('hanoiOutput_pole2').innerHTML = '[' + hanoi[1] + ']';
			document.getElementById('hanoiOutput_pole3').innerHTML = '[' + hanoi[2] + ']';
		},
		solution : function (path) {
			document.getElementById('solutionPathOutput').innerHTML = "";
			for (var i = 0; i < path.length; i = i + 2) {
				currentContent = document.getElementById('solutionPathOutput').innerHTML;
				from = path[i];
				to = path[i+1];
			document.getElementById('solutionPathOutput').innerHTML = 
				currentContent + "</br>" +
				"Move block from pole " + (from + 1) + " to " + (to + 1);
			}
		},
		victory : function () {
			return alert('Tower of Hanoi game completed: Congratulations!\nCan you solve it with higher tower?');
		},
		gameEnd : function () {
			return alert('You already won.\nTry a higher tower!');
		},
		illegalMovement : function () {
			return alert('You cannot put a bigger block onto a smaller one!')
		},
	};

	var hanoiPrototype = function () {
		var hanoiPrototype = {
			0 : [],
			1 : [],
			2 : [],
		}

		var get_height = function () {
			return 0;
		};

		var moveBlock = function (hanoi, from, to) {
			// If game is not finished yet 'moveBlock' moves block from pole 'from' to pole 'to'
			// Legal values for arguments are: 0, 1 and 2
			// You cannot move a smaller block (number) onto a bigger one
			// After the movement it checks wether the game is finished
			var isLegalMovement = function (hanoi,from,to) {
				// Legal movements are from nonempty poles 
				// to either empty pole or pole with a bigger block than the moved one
				return hanoi[from].length !== 0 
					   && ( hanoi[to].length === 0 || hanoi[from].top() <= hanoi[to].top() ) 
			};
			var isFinished = function (hanoi) {
				if (hanoi[0].length === 0 && hanoi[1].length === 0) 
					if (hanoi[2].isDecreasingArray()) {
						return true;
					}
				return false;
			};
			if (isFinished(hanoi)) {
				display.gameEnd();
				return 'Hanoi is alredy solved!'; //temp
			}
			if ( isLegalMovement(hanoi,from,to) ) {
				movedBlock = hanoi[from].pop();
				hanoi[to].push(movedBlock);
				if (isFinished(hanoi)) {
					display.victory();
					return 'You solved it!'; //temp
				}
				return hanoi;
			}
			else {
				display.illegalMovement;
				return 'Illegal block movement.'  //temp
			}	
		};

		var getSolutionPath = function () {
			// returns path - array of instructions for solution			
			var path = [];

			var otherPole = function(n,m) {
				// Input two poles, returns the third one
				// Used in hanoi solving algorithms
				switch (n + m) {
					case 0 + 1: return 2;
					case 1 + 2: return 0;
					case 0 + 2: return 1;
					default: return alert ('Bad arguments in otherPole.');
				}
			};

			return function moveTower(towerHeight,from,to) {
				if (towerHeight > 0) {
					recursivePath = moveTower( towerHeight-1, from, otherPole(from,to) )
					path = recursivePath
							.concat([from,to])
							.concat(moveTower( towerHeight-1, otherPole(from,to), to ));
				}
				else return [];
				
				return path;
			};
		}();

		var getSolutionPath_memoized = function () {
			// returns path - array of instructions for solution
			var from0to2 = [[],[0,2]];
			var otherPole = function(n,m) {
				// Input two poles, returns the third one
				// Used in hanoi solving algorithms
				switch (n + m) {
					case 0 + 1: return 2;
					case 1 + 2: return 0;
					case 0 + 2: return 1;
					default: return alert ('Bad arguments in otherPole.');
				}
			};

			var mutatePath = function (path,from,to) {
				// 'from0to2[i]' contain path needed for moving the tower of height i from 0 to 2 pole
				// 'mutatePath' mutates path for movement from 0 to 2 to path needed for movement from 'from' to 'to'
				return path.map(
								n => {
									switch (n) {
										case 0: return from;
										case 2: return to;
										case 1: return otherPole(from,to); 
										default: alert('Path is invalid for mutation');
									}
								}
				);
			};
			
			return function moveTower(towerHeight,from,to) {
				if (from0to2[towerHeight] === undefined) {
					from0to2[towerHeight-1] = moveTower(towerHeight-1,0,2);
					from0to2[towerHeight] = mutatePath(from0to2[towerHeight-1],from,otherPole(from,to))
												.concat([from,to])
												.concat(mutatePath(from0to2[towerHeight-1],otherPole(from,to),to));
				}
				return from0to2[towerHeight];
			};
		}();

		hanoiPrototype.moveBlock = function (from,to) {
			moveBlock(this,from,to);
			display.game(this);
			return this;
		};
		hanoiPrototype.show = function () {
			showed = '[' + this[0] + ']' +
					 '[' + this[1] + ']' +
					 '[' + this[2] + ']' ;
				return showed;
		};
		hanoiPrototype.showSolutionPath = function () {
			var path = getSolutionPath(this.get_height(),0,2);
			display.solution(path); // comment out while TESTING performance (it slows down the method dramatically)
			return path;
		};
		hanoiPrototype.showSolutionPath_memoized = function () {
			var path = getSolutionPath_memoized(this.get_height(),0,2);
			display.solution(path); // comment out while TESTING performance (it slows down the method dramatically)
			return path;
		};

		return hanoiPrototype;
	}();

	var makeHanoi = function (height) {
		var Hanoi = Object.create(hanoiPrototype);
		var tower = [];
		for (var i = height; i > 0; i--) {
			tower.push(i);
		}
		Hanoi[0] = tower;
		Hanoi[1] = [];
		Hanoi[2] = [];
		Hanoi.get_height = function () {
			return height;
		};

		return Hanoi;
	};

	var start = function () {
		display.cleanSolutionPathOutput();
		var height = parseInt( document.getElementById('userHeightInput').value );
		var myHanoi = makeHanoi(height);
		display.game(myHanoi);
		document.getElementById('display_game').style.visibility = "visible";
		
		towerOfHanoiGame_module.hanoi = myHanoi;
		return myHanoi;
	};
	
	towerOfHanoiGame_module.start = start;
	// towerOfHanoiGame_module.makeHanoi = makeHanoi; // for TESTING

	return towerOfHanoiGame_module;
}();
