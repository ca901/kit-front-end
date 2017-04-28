var path = require('path');

function renameCopyPath(dest, matchedSrcPath, options){
	matchedSrcPath = matchedSrcPath.replace(options.replacement, '');
	return path.join(dest, matchedSrcPath);
}

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			pug: {
				files: [
					'src/pug/**/*.pug',
				],
				tasks: ['pug']
			},
			css: {
				files: [	
					'src/sass/**/*.scss'
				],
				tasks: ['compass', 'copy:css']
			},
			css_libs: {
				files: [
					'src/sass/libs/**/*.scss',
				],
				tasks: ['compass', 'concat:css', 'copy:css']
			},
			js: {
				files: [
					'src/js/**/*.js'
				],
				tasks: ['jshint', 'browserify', 'uglify']
			}, 
			images: {
				files: [
					'src/images/**'
				],
				tasks: ['copy:images']
			},
			fonts: {
				files: [
					'src/fonts/**'
				],
				tasks: ['copy:fonts']
			}
		},

		// ES6 -> JS
		browserify: {
			dist: {
				options: {
					transform: [
						["babelify", {
							loose: "all"
						}]
					]
				},
				files: {
					"./dist/js/app.js": ["./src/js/app.js"]
				}
			}
		},

		// PUG -> HTML
		pug: {
			compile: {
				options: {
					data: {
						debug: false
					},
					pretty: true
				},
				files: {
					'dist/index.html': ['src/pug/index.pug']
				}
			}
		},

		// SCSS -> CSS
		compass: {
			dist: {
				options: {
					cacheDir: 'src/sass/.sass-cache',
					sassDir: 'src/sass/',
					cssDir: 'src/build/css/',
					outputStyle: 'expanded',
					noLineComments: true
				}
			}
		},
		

		concat: {
			// CONCAT BOWER JS LIBRARIES
			js: {
				options: {
					separator: ';\n'
				},
				files: {
					'src/build/js/libs.js':[
						'bower_components/jquery/dist/jquery.min.js',
						'bower_components/jquery-ui/jquery-ui.min.js',
            			'bower_components/bootstrap/dist/js/bootstrap.min.js'
					]
				}
			},

			// CONCAT BOWER CSS LIBRARIES & SASS UTILS
			css: {
				options: {
					separator: '\n'
				},
				files: {
					'src/build/css/libs.css':[
						'bower_components/jquery-ui/themes/smoothness/jquery-ui.min.css',
						'bower_components/bootstrap/dist/css/bootstrap.min.css',
						'bower_components/font-awesome/css/font-awesome.min.css',
						'src/build/css/sass-libs.css'
					]
				}
			}
		},

		// MINIFY JS LIBS
		uglify: {
			scripts: {
				files: {
					'dist/js/libs.min.js': [
						'src/build/js/libs.js'
					]
				}
			}
		},

		// MINIFY CSS LIBS
		cssmin: {
			options: {
		        keepSpecialComments: 0
		    },
			css:{
				src: 'src/build/css/libs.css',
				dest: 'dist/css/libs.min.css'
			}
		},

		// JS VALIDATE
		jshint: {
			options: {
		      esnext: true
		    },
			validate: {
				files:{
					src:[
						'src/js/app.js'
					],
				}
			}
		},

		copy: {
			css: {
				files:[
					{
						expand: true,
						src: ['src/build/css/style.css'],
						replacement: 'src/build/css/',
						dest: 'dist/css/',
						filter: 'isFile',
						rename: renameCopyPath
					}
				]
			},
			images: {
				files:[
					{
						expand: true,
						src: ['src/images/**'],
						replacement: 'src/images/',
						dest: 'dist/images/',
						filter: 'isFile',
						rename: renameCopyPath
					},
					{
						expand: true,
						src: ['bower_components/jquery-ui/themes/smoothness/images/**'],
						replacement: 'bower_components/jquery-ui/themes/smoothness/images/',
						dest: 'dist/css/images/',
						filter: 'isFile',
						rename: renameCopyPath
					}
				]
			},
			fonts: {
				files:[
					{
						expand: true,
						src: ['src/fonts/**'],
						replacement: 'src/fonts/',
						dest: 'dist/fonts/',
						filter: 'isFile',
						rename: renameCopyPath
					},
					{
						expand: true,
						src: ['bower_components/bootstrap/dist/fonts/**'],
						replacement: 'bower_components/bootstrap/dist/fonts/',
						dest: 'dist/fonts/',
						filter: 'isFile',
						rename: renameCopyPath
					},
					{
						expand: true,
						src: ['bower_components/font-awesome/fonts/**'],
						replacement: 'bower_components/font-awesome/fonts/',
						dest: 'dist/fonts/',
						filter: 'isFile',
						rename: renameCopyPath
					}
				]
			}
		}
		
	});

	// Load the Grunt plugins.
  	grunt.loadNpmTasks('grunt-contrib-pug');
  	grunt.loadNpmTasks("grunt-browserify");
  	grunt.loadNpmTasks('grunt-contrib-concat');
  	grunt.loadNpmTasks('grunt-css');
  	grunt.loadNpmTasks('grunt-contrib-copy');
  	grunt.loadNpmTasks('grunt-contrib-jshint');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Register the default tasks.
	grunt.registerTask('default', ['pug', 'compass', 'concat', 'cssmin', 'jshint', 'browserify', 'uglify', 'copy', 'watch']);
};
