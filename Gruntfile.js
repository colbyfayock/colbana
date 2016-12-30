module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        env: grunt.file.readJSON('config.json'),

        concat: {

            options: {
                separator: ';',
            },

            us: {
                src: [

                    // Bower components

                    './bower_components/modernizr/modernizr.js',
                    './bower_components/photoswipe/dist/photoswipe.js',
                    './bower_components/photoswipe/dist/photoswipe-ui-default.js',
                    './bower_components/hippify/hippify/hippify.js',

                    './build/us/js/components/**/*.js',


                    // Main

                    './build/us/js/main.js'

                ],
                dest: './us/js/colbana.js',
            },

        },

        uglify: {

            options: {
                banner: '/*\n' +
                    ' * <%= pkg.name %>\n' +
                    ' */\n',
                mangle: false,
                compress: false
            },

            us: {
                files: {
                    './us/js/colbana.min.js': [
                        './us/js/colbana.js'
                    ]
                }
            }

        },

        sass: {

            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },

            us: {
                files: {
                    './us/css/colbana.min.css': './build/us/scss/main.scss'
                }
            }

        },

        rsync: {

            options: {
                args: [
                    "-avhzS --progress"
                ],
                exclude: [

                    ".git*",

                    "build",

                    "bower_components",
                    "node_modules",

                    "package.json",
                    "bower.json",
                    "*.sublime*",

                ],
                recursive: true
            },

            deployus: {
                options: {
                    src: '<%= env.rsync.deploy.us.src %>',
                    dest: '<%= env.rsync.deploy.us.dest %>',
                    host: '<%= env.rsync.deploy.us.host %>',
                    delete: false
                }
            },

            deploybr: {
                options: {
                    src: '<%= env.rsync.deploy.br.src %>',
                    dest: '<%= env.rsync.deploy.br.dest %>',
                    host: '<%= env.rsync.deploy.br.host %>',
                    delete: false
                }
            }

        },

        watch: {

            us_css: {
                files: './build/us/scss/**/*.scss',
                tasks: [
                    'us_css'
                ]
            },

            us_js: {
                files: './build/us/js/**/*.js',
                tasks: [
                    'us_js'
                ]
            },

        }

    });

    grunt.registerTask('default', [
    ]);

    grunt.registerTask('us_css', [
        'sass:us'
    ]);

    grunt.registerTask('css', [
        'us_css'
    ]);

    grunt.registerTask('us_js', [
        'concat:us',
        'uglify:us'
    ]);

    grunt.registerTask('js', [
        'us_js'
    ]);

};