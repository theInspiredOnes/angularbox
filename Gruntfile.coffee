'use strict'

module.exports = (grunt) ->
	require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

	grunt.initConfig
		buildDir: './build'
		srcDir: './src'
		tmpDir: '.tmp'
		pkg: grunt.file.readJSON 'package.json'
		src:
			coffee: [ '<%= srcDir %>/assets/coffee/**/*.coffee' ]
			less: '<%= srcDir %>/assets/css/<%= pkg.name %>.less'
			#jade: 'jade/*.jade'
			js: '<%= srcDir %>/assets/js/**/*.js'
		clean:
			tmp: [ '.tmp' ]

		recess:
			build:
				src: [ '<%= src.less %>' ],
				dest: '<%= buildDir %>/css/<%= pkg.name %>.css',
				options:
					compile: true
					compress: true

		coffee:
			build:
				options:
					bare: true
				files: [
					expand: true,
					cmd: 'coffee',
					src: [ '<%= src.coffee %>' ],
					dest: '.tmp/js/',
					ext: '.js'
				]

		concat:
			build:
				src: [
					'module.prefix'
					'.tmp/js/**/*.js'
					#'<%= src.js %>'
					'module.suffix'
				]
				dest: '<%= tmpDir %>/js/<%= pkg.name %>.js'

		# Annotate angular sources
		ngmin:
			build:
				src: [ '<%= tmpDir %>/js/<%= pkg.name %>.js' ]
				dest: '<%= buildDir %>/js/<%= pkg.name %>.annotated.js'

		# Minify the sources!
		uglify:
			build:
				files:
					'<%= buildDir %>/js/<%= pkg.name %>.min.js': [ '<%= buildDir %>/js/<%= pkg.name %>.annotated.js' ]

		delta:
			options:
				livereload: true
			# js:
			# 	files: [ '<%= src.js %>' ]
			# 	tasks: [
			# 		'concat'
			# 		'ngmin'
			# 		'uglify'
			# 	]
			coffee:
				files: [ '<%= src.coffee %>' ]
				tasks: [
					'clean'
					'coffee'
					'concat'
					'ngmin'
					'uglify'
				]
			less:
				files: [ '<%= src.less %>' ]
				tasks: [ 'recess' ]



	grunt.renameTask 'watch', 'delta'
	grunt.registerTask 'watch', [
		'build'
		'delta'
	]

	# The default task is to build.
	grunt.registerTask 'default', [ 'build' ]
	grunt.registerTask 'build', [
		'clean'
		'recess'
		'coffee'
		'concat'
		'ngmin'
		'uglify'
	]
